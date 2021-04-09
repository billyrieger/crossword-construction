// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
#![no_std]

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn square(x: i64) -> i64 {
    x * x
}
