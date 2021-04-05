use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn square(x: i32) -> i32 {
    x * x
}