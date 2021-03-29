// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use crate::state::{SparseBitSet, SparseSet, State, Timestamp};
use crate::util::{BitSet, BitWord};
use crate::ALPHABET_LEN;

use std::fmt;
use std::io::prelude::*;
use std::io::BufReader;
use std::marker::PhantomData;
use std::rc::Rc;

#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
#[repr(transparent)]
pub struct Letter(pub usize);

impl Letter {
    fn wrap_slice(s: &[usize]) -> &[Letter] {
        unsafe { &*(s as *const [usize] as *const [Letter]) }
    }
}

#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub struct WordId(pub usize);

pub type Word = Vec<Letter>;

#[derive(Debug)]
pub struct Dictionary {
    word_len: usize,
    pub words: Vec<Word>,
    supports: Vec<Vec<BitWord>>,
}

impl Dictionary {
    pub fn from_wordlist(max_len: usize, wordlist: &[u8]) -> Vec<Rc<Self>> {
        let reader = BufReader::new(wordlist);
        let mut words: Vec<Vec<_>> = vec![vec![]; max_len + 1];
        for line in reader.lines() {
            if let Ok(line) = line {
                if let Some(word) = deunicode::deunicode(&line)
                    .bytes()
                    .map(|b| {
                        if b.is_ascii_alphabetic() {
                            Some(Letter((b.to_ascii_uppercase() - b'A') as usize))
                        } else {
                            None
                        }
                    })
                    .collect::<Option<Word>>()
                {
                    if word.len() < max_len {
                        words[word.len()].push(word);
                    }
                }
            }
        }
        words
            .into_iter()
            .enumerate()
            .map(|(len, words)| Rc::new(Self::new(words, len)))
            .collect()
    }

    pub fn new(words: Vec<Word>, word_len: usize) -> Self {
        assert!(words.iter().all(|w| w.len() == word_len));

        let mut supports: Vec<Vec<BitWord>> = std::iter::repeat(BitSet::empty(words.len()))
            .take(ALPHABET_LEN * word_len)
            .collect();

        for (index, word) in words.iter().enumerate() {
            for (pos, &letter) in word.iter().enumerate() {
                BitSet::set_bit(&mut supports[pos * ALPHABET_LEN + letter.0], index, true);
            }
        }

        Self {
            words,
            word_len,
            supports,
        }
    }

    pub fn len(&self) -> usize {
        self.words.len()
    }

    pub fn word_len(&self) -> usize {
        self.word_len
    }

    pub fn get(&self, word: WordId) -> &Word {
        &self.words[word.0]
    }

    pub fn supports(&self, pos: usize, letter: Letter) -> &[BitWord] {
        assert!(letter.0 < ALPHABET_LEN);
        assert!(pos < self.word_len);
        &self.supports[ALPHABET_LEN * pos + letter.0]
    }
}

#[derive(Debug)]
pub struct Cell {
    domain: SparseSet,
}

impl Cell {
    pub fn new() -> Self {
        Self {
            domain: SparseSet::new(ALPHABET_LEN),
        }
    }

    pub fn len(&self) -> usize {
        self.domain.len()
    }

    pub fn is_empty(&self) -> bool {
        self.domain.is_empty()
    }

    pub fn value(&self, i: usize) -> Letter {
        Letter(self.domain.values()[i])
    }

    pub fn values(&self) -> &[Letter] {
        Letter::wrap_slice(self.domain.values())
    }

    pub fn past_values(&self, prev_len: usize) -> &[Letter] {
        Letter::wrap_slice(self.domain.past_values(prev_len))
    }

    pub fn remove(&mut self, letter: Letter) {
        self.domain.remove(letter.0)
    }
}

impl State for Cell {
    fn save(&mut self, now: Timestamp) {
        self.domain.save(now);
    }

    fn backtrack(&mut self, then: Timestamp) {
        self.domain.backtrack(then);
    }
}

pub struct Entry {
    pub domain: SparseBitSet,
    dict: Rc<Dictionary>,
}

impl fmt::Debug for Entry {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        f.debug_struct("Entry")
            .field("domain", &self.domain)
            .finish()
    }
}

impl Entry {
    pub fn new(dict: Rc<Dictionary>) -> Self {
        Self {
            domain: SparseBitSet::new(dict.len()),
            dict,
        }
    }

    pub fn len(&self) -> usize {
        self.domain.len()
    }

    pub fn is_empty(&self) -> bool {
        self.domain.is_empty()
    }

    pub fn get(&self, word: WordId) -> &Word {
        self.dict.get(word)
    }

    pub fn any_value(&self) -> Option<WordId> {
        self.domain.any_value().map(|index| WordId(index))
    }

    pub fn assign_word(&mut self, word: WordId) {
        self.domain.assign(word.0);
    }

    pub fn remove_word(&mut self, word: WordId) {
        self.domain.remove(word.0);
    }

    pub fn remove_letters(&mut self, pos: usize, letters: &[Letter]) {
        self.domain.clear_mask();
        for &letter in letters {
            self.domain.mask_union(self.dict.supports(pos, letter));
        }
        self.domain.negate_mask();
        self.domain.apply_mask();
    }

    pub fn retain_letters(&mut self, pos: usize, letters: &[Letter]) {
        self.domain.clear_mask();
        for &letter in letters {
            self.domain.mask_union(self.dict.supports(pos, letter));
        }
        self.domain.apply_mask();
    }

    pub fn supports(&self, letter: Letter, pos: usize) -> &[BitWord] {
        self.dict.supports(pos, letter)
    }

    pub fn find_support(&self, supports: &[BitWord], residue: usize) -> Option<usize> {
        if self.domain.intersects_at(supports, residue) {
            Some(residue)
        } else {
            self.domain.find_intersection(supports)
        }
    }
}

impl State for Entry {
    fn save(&mut self, now: Timestamp) {
        self.domain.save(now);
    }

    fn backtrack(&mut self, then: Timestamp) {
        self.domain.backtrack(then);
    }
}

pub struct Id<T> {
    index: usize,
    marker: PhantomData<T>,
}

impl<T> Id<T> {
    pub const fn new(index: usize) -> Self {
        Self {
            index,
            marker: PhantomData,
        }
    }

    pub const fn index(&self) -> usize {
        self.index
    }
}

impl<T> Clone for Id<T> {
    fn clone(&self) -> Self {
        Self::new(self.index)
    }
}

impl<T> Copy for Id<T> {}

impl<T> fmt::Debug for Id<T> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        f.debug_tuple("Id").field(&self.index).finish()
    }
}

impl<T> Eq for Id<T> {}

impl<T> PartialEq for Id<T> {
    fn eq(&self, other: &Self) -> bool {
        self.index == other.index
    }
}

#[derive(Debug)]
pub struct Store<T> {
    items: Vec<T>,
}

impl<T> Store<T> {
    pub fn new() -> Self {
        Self { items: vec![] }
    }

    pub fn add_item(&mut self, item: T) -> Id<T> {
        let index = self.items.len();
        self.items.push(item);
        Id::new(index)
    }

    pub fn len(&self) -> usize {
        self.items.len()
    }

    pub fn iter(&self) -> impl Iterator<Item = &T> {
        self.items.iter()
    }

    pub fn get(&self, id: Id<T>) -> &T {
        self.items.get(id.index).expect("id out of bounds")
    }

    pub fn get_mut(&mut self, id: Id<T>) -> &mut T {
        self.items.get_mut(id.index).expect("id out of bounds")
    }
}

impl<T> State for Store<T>
where
    T: State,
{
    fn save(&mut self, now: Timestamp) {
        self.items.iter_mut().for_each(|item| item.save(now));
    }

    fn backtrack(&mut self, then: Timestamp) {
        self.items.iter_mut().for_each(|item| item.backtrack(then));
    }
}
