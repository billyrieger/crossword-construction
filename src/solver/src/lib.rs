// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use wasm_bindgen::prelude::*;

type Entry = Vec<usize>;

struct Input {
    words: Vec<String>,
    entries: Vec<Vec<Entry>>,
}

impl Input {
    const fn new() -> Self {
        Self {
            entries: vec![],
            words: vec![],
        }
    }

    fn add_entry(&mut self, entry: Entry) {
        self.entries
            .resize(self.entries.len().max(entry.len() + 1), vec![]);
        self.entries[entry.len()].push(entry);
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

#[wasm_bindgen]
pub fn begin_search() -> String {
    "ASDF".into()
}
