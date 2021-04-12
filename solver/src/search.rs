// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use std::rc::Rc;

use crate::state::{State, Timestamp};
use crate::var::{Cell, Entry, Id, Store, Word, WordId};
use crate::{
    constraint::{AllDiff, Table},
    var::Dictionary,
};

#[derive(Clone, Copy, Debug, Eq, Hash, PartialEq)]
enum Status {
    Unsolved,
    Solved,
    Failed,
}

#[derive(Debug)]
pub struct SearchState {
    pub cells: Store<Cell>,
    pub entries: Store<Entry>,
    pub tables: Vec<Table>,
    pub alldiffs: Vec<AllDiff>,
}

impl SearchState {
    pub fn new(input: Vec<Vec<usize>>, dicts: Vec<Rc<Dictionary>>) -> Self {
        let n_cells: usize = input
            .iter()
            .map(|entry| entry.iter().max().copied().unwrap_or(0))
            .max()
            .unwrap_or(0)
            + 1;
        let max_entry_len: usize = input.iter().map(|cells| cells.len()).max().unwrap_or(0);

        let mut all_cells = Store::<Cell>::new();
        let mut entries = Store::<Entry>::new();
        let mut tables = vec![];
        let mut entries_by_len: Vec<Vec<Id<Entry>>> = vec![vec![]; max_entry_len + 1];

        for _ in 0..n_cells {
            all_cells.add_item(Cell::new());
        }

        for cells in input {
            let entry_len = cells.len();
            let entry = Entry::new(dicts[entry_len].clone());
            let entry_id = entries.add_item(entry);
            let cell_ids = cells.into_iter().map(Id::new).collect();
            tables.push(Table::new(entry_id, cell_ids));
            entries_by_len[entry_len].push(entry_id);
        }

        let mut alldiffs = vec![];
        for entries in entries_by_len.into_iter() {
            if !entries.is_empty() {
                alldiffs.push(AllDiff::new(entries));
            }
        }

        Self {
            cells: all_cells,
            entries,
            tables,
            alldiffs,
        }
    }

    fn status(&self) -> Status {
        let mut solved = true;
        for entry in self.entries.iter() {
            if entry.len() == 0 {
                return Status::Failed;
            }
            solved = solved && entry.len() == 1;
        }
        if solved {
            Status::Solved
        } else {
            Status::Unsolved
        }
    }

    fn propagate(&mut self) {
        let mut sum: usize = self.entries.iter().map(|entry| entry.len()).sum();
        loop {
            for constraint in &mut self.tables {
                constraint.filter_cells(&mut self.cells, &self.entries);
            }
            for constraint in &mut self.tables {
                constraint.filter_entry(&self.cells, &mut self.entries);
            }
            for constraint in &mut self.alldiffs {
                constraint.filter(&mut self.entries);
            }

            let new_sum: usize = self.entries.iter().map(|entry| entry.len()).sum();
            if sum == new_sum {
                break;
            } else {
                sum = new_sum;
            }
        }
    }
}

impl State for SearchState {
    fn save(&mut self, now: Timestamp) {
        self.cells.save(now);
        self.entries.save(now);
        self.tables.iter_mut().for_each(|c| c.save(now));
        self.alldiffs.iter_mut().for_each(|c| c.save(now));
    }

    fn restore(&mut self, then: Timestamp) {
        self.cells.restore(then);
        self.entries.restore(then);
        self.tables.iter_mut().for_each(|c| c.restore(then));
        self.alldiffs.iter_mut().for_each(|c| c.restore(then));
    }
}

pub struct Solver {
    pub state: SearchState,
    decisions: Vec<(Timestamp, Id<Entry>, WordId)>,
    now: Timestamp,
}

impl Solver {
    pub fn new(mut state: SearchState) -> Self {
        let now = Timestamp(0);
        state.save(now);
        Self {
            decisions: vec![],
            state,
            now,
        }
    }

    fn backtrack(&mut self) -> Option<()> {
        if let Some((ts, entry, word)) = self.decisions.pop() {
            self.now = Timestamp(ts.0 - 1);
            self.state.restore(self.now);
            self.state.entries.get_mut(entry).remove_word(word);
            Some(())
        } else {
            None
        }
    }

    pub fn solve(&mut self) -> Option<Vec<Word>> {
        loop {
            self.state.propagate();
            match self.state.status() {
                Status::Solved => {
                    let soln: Vec<Word> = self
                        .state
                        .entries
                        .iter()
                        .map(|entry| entry.get(entry.any_value().unwrap()).clone())
                        .collect();

                    self.backtrack();
                    return Some(soln);
                }

                Status::Failed => {
                    if self.backtrack().is_none() {
                        return None;
                    }
                }

                Status::Unsolved => {
                    self.state.save(self.now);
                    self.now = Timestamp(self.now.0 + 1);

                    let (entry, word) = self.decide();
                    self.state.entries.get_mut(entry).assign_word(word);

                    self.decisions.push((self.now, entry, word));
                }
            }
        }
    }

    fn decide(&self) -> (Id<Entry>, WordId) {
        let (i, entry) = self
            .state
            .entries
            .iter()
            .enumerate()
            .filter(|(_, entry)| entry.len() > 1)
            .min_by_key(|(_, entry)| entry.len())
            .expect("could not find entry");
        let id = Id::<Entry>::new(i);
        let word = entry.any_value().expect("len is greater than 1");
        (id, word)
    }
}
