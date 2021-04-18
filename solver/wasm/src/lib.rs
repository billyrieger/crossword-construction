use solver_lib::Input;
use wasm_bindgen::prelude::*;

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
pub fn add_entry(entry: Vec<usize>) {
    unsafe {
        INPUT.entries.push(entry);
    }
}

#[wasm_bindgen]
pub fn add_word(word: String) {
    unsafe {
        INPUT.words.push(word);
    }
}

#[wasm_bindgen]
pub fn finalize() {
    unsafe {
        INPUT.finalize();
    }
}

#[wasm_bindgen]
pub fn search() -> Option<String> {
    unsafe { INPUT.search() }
}
