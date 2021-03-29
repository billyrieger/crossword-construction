// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

pub mod constraint;
pub mod search;
pub mod state;
pub mod util;
pub mod var;

use search::{SearchState, Solver};
use var::Dictionary;
use wasm_bindgen::prelude::*;

const ALPHABET_LEN: usize = 26;

pub const WORDLIST: &'static [u8] = include_bytes!("../../../nyt.txt");

#[wasm_bindgen]
pub fn solve(entries: JsValue) -> JsValue {
    let entries: Vec<Vec<usize>> = entries.into_serde().expect("bad entries");
    let dicts = Dictionary::from_wordlist(15, &WORDLIST);
    let state = SearchState::new(entries, dicts.clone());
    let mut solver = Solver::new(state);

    web_sys::console::log_1(&"about to solve".into());

    loop {
        match solver.solve() {
            Some(_) => {
                let mut all_letters = vec![];
                for cell in solver.state.cells.iter() {
                    all_letters.push(cell.value(0));
                }
                return all_letters
                    .into_iter()
                    .map(|letter| (letter.0 as u8 + b'A') as char)
                    .collect::<String>()
                    .into();
            }
            None => {
                return "NOT FOUND".into();
            }
        }
    }
}
