use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn double(input: i32) -> i32 {
    input * 2
}
