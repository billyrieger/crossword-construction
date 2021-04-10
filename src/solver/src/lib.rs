// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use wasm_bindgen::prelude::*;

type Entry = Vec<usize>;

struct Input {
    words: Vec<String>,
    entries: Vec<Entry>,
}

impl Input {
    const fn new() -> Self {
        Self {
            entries: vec![],
            words: vec![],
        }
    }

    fn add_entry(&mut self, entry: Entry) {
        self.entries.push(entry);
    }

    fn add_word(&mut self, word: String) {
        self.words.push(word);
    }
}

static mut INPUT: Input = Input::new();

#[wasm_bindgen]
pub fn init() {}

#[wasm_bindgen]
pub fn reset() {
    unsafe {
        INPUT.entries.clear();
    }
}

#[wasm_bindgen]
pub fn add_entry(entry: Entry) {
    unsafe {
        INPUT.add_entry(entry);
    }
}

#[wasm_bindgen]
pub fn add_word(word: String) {
    unsafe {
        INPUT.add_word(word);
    }
}

pub mod constraint;
pub mod search;
pub mod state;
pub mod util;
pub mod var;

const ALPHABET_LEN: usize = 26;

pub const WORDLIST: &'static [u8] = include_bytes!("../../../peter-broda-wordlist__unscored.txt");

use search::{SearchState, Solver};
use var::{Dictionary, Letter};

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}

fn make_char(letter: Letter) -> char {
    (letter.0 as u8 + b'A') as char
}

#[wasm_bindgen]
pub fn begin_search() -> Option<String> {
    let max_word_len: usize = 15;

    let dicts = Dictionary::from_wordlist(max_word_len, &WORDLIST);
    let cells = unsafe { INPUT.entries.clone() };
    let state = SearchState::new(cells, dicts.clone());
    let mut solver = Solver::new(state);

    loop {
        match solver.solve() {
            Some(_) => {
                let mut all_letters = vec![];
                for cell in solver.state.cells.iter() {
                    all_letters.push(cell.value(0));
                }
                return Some(all_letters.into_iter().map(make_char).collect());
            }
            None => {
                return None;
            }
        }
    }
}
