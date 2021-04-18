// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

pub mod constraint;
pub mod search;
pub mod state;
pub mod util;
pub mod var;

const ALPHABET_LEN: usize = 26;

type Entry = Vec<usize>;

use search::{SearchState, Solver};
use std::rc::Rc;
use var::Dictionary;

pub struct Input {
    pub words: Vec<String>,
    dicts: Option<Vec<Rc<Dictionary>>>,
    pub entries: Vec<Entry>,
}

impl Input {
    pub const fn new() -> Self {
        Self {
            entries: vec![],
            words: vec![],
            dicts: None,
        }
    }

    pub fn finalize(&mut self) {
        self.dicts = Some(Dictionary::from_words(15, &self.words));
    }

    pub fn search(&self) -> Option<String> {
        // let max_word_len: usize = 15;

        let dicts = self.dicts.clone().unwrap();
        let cells = self.entries.clone();
        let state = SearchState::new(cells, dicts.clone());
        let mut solver = Solver::new(state);

        loop {
            match solver.solve() {
                Some(_) => {
                    let mut all_letters = vec![];
                    for cell in solver.state.cells.iter() {
                        all_letters.push(cell.value(0));
                    }
                    return Some(
                        all_letters
                            .into_iter()
                            .map(|l| (l.0 as u8 + b'A') as char)
                            .collect(),
                    );
                }
                None => {
                    return None;
                }
            }
        }
    }
}
