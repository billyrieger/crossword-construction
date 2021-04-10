// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use crate::util::{BitSet, BitWord, WORD_LEN};

use std::fmt;
use std::ops::{Deref, DerefMut};

/// Any object that can save and restore its state.
pub trait State {
    fn save(&mut self, now: Timestamp);
    fn restore(&mut self, then: Timestamp);
}

#[derive(Clone, Copy, Debug, Default, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub struct Timestamp(pub usize);

/// A smart pointer that keeps a local stack of previous values.
#[derive(Debug)]
pub struct Trailed<T> {
    value: T,
    initial: T,
    history: Vec<(Timestamp, T)>,
}

impl<T> Trailed<T>
where
    T: Clone + PartialEq,
{
    pub fn new(value: T) -> Self {
        Self {
            value: value.clone(),
            initial: value,
            history: vec![],
        }
    }
}

impl<T> State for Trailed<T>
where
    T: Clone + PartialEq,
{
    fn save(&mut self, now: Timestamp) {
        if self.value != *self.history.last().map(|(_, t)| t).unwrap_or(&self.initial) {
            self.history.push((now, self.value.clone()));
        }
    }

    fn restore(&mut self, then: Timestamp) {
        while let Some((saved_at, prev_value)) = self.history.pop() {
            if saved_at <= then {
                self.value = prev_value.clone();
                self.history.push((saved_at, prev_value));
                return;
            }
        }
        self.value = self.initial.clone();
    }
}

impl<T> Deref for Trailed<T> {
    type Target = T;

    fn deref(&self) -> &T {
        &self.value
    }
}

impl<T> DerefMut for Trailed<T> {
    fn deref_mut(&mut self) -> &mut T {
        &mut self.value
    }
}

impl fmt::Debug for SparseSet {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        f.debug_struct("SparseSet")
            .field("values", &&self.values[0..*self.len])
            .finish()
    }
}

pub struct SparseSet {
    values: Vec<usize>,
    index: Vec<usize>,
    len: Trailed<usize>,
}

impl SparseSet {
    /// Creates a full `SparseSet` that contains the values `0..len`.
    pub fn new(len: usize) -> Self {
        Self {
            values: (0..len).collect(),
            index: (0..len).collect(),
            len: Trailed::new(len),
        }
    }

    pub fn len(&self) -> usize {
        *self.len
    }

    pub fn is_empty(&self) -> bool {
        *self.len == 0
    }

    pub fn now_and_then(&self, prev_len: usize) -> (&[usize], &[usize]) {
        self.values[..prev_len].split_at(*self.len)
    }

    pub fn values(&self) -> &[usize] {
        &self.values[..*self.len]
    }

    pub fn past_values(&self, prev_len: usize) -> &[usize] {
        &self.values[*self.len..prev_len]
    }

    pub fn contains(&self, value: usize) -> bool {
        self.index[value] < *self.len
    }

    pub fn assign(&mut self, value: usize) {
        if self.contains(value) {
            *self.len = 1;
            self.swap(self.index[value], 0);
        } else {
            *self.len = 0;
        }
    }

    pub fn remove(&mut self, value: usize) {
        if self.contains(value) {
            *self.len -= 1;
            self.swap(self.index[value], *self.len);
        }
    }

    fn swap(&mut self, i: usize, j: usize) {
        self.values.swap(i, j);
        self.index.swap(self.values[i], self.values[j]);
    }
}

impl State for SparseSet {
    fn save(&mut self, now: Timestamp) {
        self.len.save(now);
    }

    fn restore(&mut self, then: Timestamp) {
        self.len.restore(then);
    }
}

#[derive(Debug)]
pub struct SparseBitSet {
    words: Vec<Trailed<BitWord>>,
    indices: SparseSet,
    mask: Vec<BitWord>,
}

impl SparseBitSet {
    pub fn new(len: usize) -> Self {
        let words: Vec<Trailed<BitWord>> = BitSet::full(len)
            .into_iter()
            .map(|word| Trailed::new(word))
            .collect();
        Self {
            indices: SparseSet::new(words.len()),
            mask: BitSet::empty(len),
            words,
        }
    }

    pub fn len(&self) -> usize {
        self.indices
            .values()
            .iter()
            .map(|&index| self.words[index].count_ones() as usize)
            .sum()
    }

    pub fn is_empty(&self) -> bool {
        self.indices
            .values()
            .iter()
            .all(|&index| *self.words[index] == 0)
    }

    pub fn any_value(&self) -> Option<usize> {
        if self.is_empty() {
            None
        } else {
            let index = self.indices.values()[0];
            let offset = self.words[index].trailing_zeros() as usize;
            Some(index * WORD_LEN + offset)
        }
    }

    pub fn remove(&mut self, value: usize) {
        let (index, offset) = (value / WORD_LEN, value % WORD_LEN);
        if self.indices.contains(index) {
            *self.words[index] &= !(1 << offset);
            if *self.words[index] == 0 {
                self.indices.remove(index);
            }
        }
    }

    pub fn assign(&mut self, value: usize) {
        let (index, offset) = (value / WORD_LEN, value % WORD_LEN);
        self.indices.assign(index);
        *self.words[index] &= 1 << offset;
        if *self.words[index] == 0 {
            self.indices.remove(index);
        }
        debug_assert!(self.len() <= 1);
    }

    pub fn clear_mask(&mut self) {
        for &index in self.indices.values() {
            self.mask[index] = 0;
        }
    }

    pub fn negate_mask(&mut self) {
        for &index in self.indices.values() {
            self.mask[index] = !self.mask[index];
        }
    }

    pub fn mask_union(&mut self, other: &[BitWord]) {
        for &index in self.indices.values() {
            self.mask[index] |= other[index];
        }
    }

    pub fn apply_mask(&mut self) {
        for i in (0..self.indices.len()).rev() {
            let offset = self.indices.values()[i];
            *self.words[offset] &= self.mask[offset];
            if *self.words[offset] == 0 {
                self.indices.remove(offset);
            }
        }
    }

    pub fn intersects_at(&self, array: &[BitWord], index: usize) -> bool {
        self.indices.contains(index) && *self.words[index] & array[index] != 0
    }

    pub fn find_intersection(&self, array: &[BitWord]) -> Option<usize> {
        self.indices
            .values()
            .iter()
            .copied()
            .find(|&index| *self.words[index] & array[index] != 0)
    }
}

impl State for SparseBitSet {
    fn save(&mut self, now: Timestamp) {
        self.indices.save(now);
        for &index in self.indices.values() {
            self.words[index].save(now);
        }
    }

    fn restore(&mut self, then: Timestamp) {
        self.indices.restore(then);
        for &index in self.indices.values() {
            self.words[index].restore(then);
        }
    }
}
