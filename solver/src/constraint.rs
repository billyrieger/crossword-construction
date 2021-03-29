// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use crate::state::{State, Timestamp, Trailed};
use crate::var::{Cell, Entry, Id, Letter, Store};
use crate::ALPHABET_LEN;

#[derive(Debug)]
pub struct Table {
    entry_id: Id<Entry>,
    cell_ids: Vec<Id<Cell>>,
    last_cell_sizes: Vec<usize>,
    residues: Residues,
}

impl Table {
    pub fn new(entry: Id<Entry>, cells: Vec<Id<Cell>>) -> Self {
        Self {
            last_cell_sizes: vec![ALPHABET_LEN; cells.len()],
            residues: Residues::new(cells.len()),
            entry_id: entry,
            cell_ids: cells,
        }
    }

    pub fn filter_entry(&self, cells: &Store<Cell>, entries: &mut Store<Entry>) {
        let entry: &mut Entry = entries.get_mut(self.entry_id);

        for (pos, &id) in self.cell_ids.iter().enumerate() {
            let cell: &Cell = cells.get(id);

            let prev_len = self.last_cell_sizes[pos];
            if cell.len() != prev_len {
                if cell.len() < prev_len - cell.len() {
                    entry.retain_letters(pos, cell.values());
                } else {
                    entry.remove_letters(pos, cell.past_values(self.last_cell_sizes[pos]));
                }
            }
        }
    }

    pub fn filter_cells(&mut self, cells: &mut Store<Cell>, entries: &Store<Entry>) {
        let entry: &Entry = entries.get(self.entry_id);

        for (pos, &cell_id) in self.cell_ids.iter().enumerate() {
            let cell: &mut Cell = cells.get_mut(cell_id);

            if cell.len() > 1 {
                for i in (0..cell.len()).rev() {
                    let letter = cell.value(i);
                    let residue = self.residues.get_mut(pos, letter);
                    let supports = entry.supports(letter, pos);
                    if let Some(new_res) = entry.find_support(supports, *residue) {
                        *residue = new_res;
                    } else {
                        cell.remove(letter);
                    }
                }
            }
        }
    }
}

impl State for Table {
    fn save(&mut self, _now: Timestamp) {}
    fn backtrack(&mut self, _then: Timestamp) {}
}

#[derive(Debug)]
struct Residues {
    data: Vec<usize>,
}

impl Residues {
    fn new(word_len: usize) -> Self {
        Self {
            data: vec![0; word_len * ALPHABET_LEN],
        }
    }

    fn get_mut(&mut self, position: usize, letter: Letter) -> &mut usize {
        &mut self.data[position * ALPHABET_LEN + letter.0]
    }
}

#[derive(Debug)]
pub struct AllDiff {
    entries: Vec<Id<Entry>>,
    unassigned: Trailed<usize>,
}

impl AllDiff {
    pub fn new(entries: Vec<Id<Entry>>) -> Self {
        Self {
            unassigned: Trailed::new(entries.len()),
            entries,
        }
    }

    pub fn filter(&mut self, entries: &mut Store<Entry>) {
        let mut done = false;
        while !done {
            done = true;
            for i in (0..*self.unassigned).rev() {
                if entries.get(self.entries[i]).len() == 1 {
                    done = false;
                    let assigned_word = entries.get(self.entries[i]).any_value().unwrap();
                    self.entries.swap(i, *self.unassigned - 1);
                    *self.unassigned -= 1;
                    for &id in &self.entries[..*self.unassigned] {
                        entries.get_mut(id).remove_word(assigned_word);
                    }
                }
            }
        }
    }
}

impl State for AllDiff {
    fn save(&mut self, now: Timestamp) {
        self.unassigned.save(now);
    }

    fn backtrack(&mut self, then: Timestamp) {
        self.unassigned.backtrack(then);
    }
}
