// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
use wasm_bindgen::prelude::*;

type Entry = Vec<usize>;

struct Input {
    entries: Vec<Vec<Entry>>,
}

impl Input {
    const fn new() -> Self {
        Self { entries: vec![] }
    }

    fn add_entry(&mut self, entry: Entry) {
        self.entries
            .resize(self.entries.len().max(entry.len() + 1), vec![]);
        self.entries[entry.len()].push(entry);
    }
}

static mut INPUT: Input = Input::new();

#[wasm_bindgen]
pub fn clear() {
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
pub fn entries_len(len: usize) -> usize {
    unsafe {
        INPUT
            .entries
            .get(len)
            .map(|entries| entries.len())
            .unwrap_or(0)
    }
}