// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use std::fmt;

pub type BitWord = u64;
pub const WORD_LEN: usize = std::mem::size_of::<BitWord>() * 8;

pub struct BitSet;

impl BitSet {
    pub fn empty(len: usize) -> Vec<BitWord> {
        let (quot, rem) = (len / WORD_LEN, len % WORD_LEN);
        vec![0; if rem != 0 { quot + 1 } else { quot }]
    }

    pub fn full(len: usize) -> Vec<BitWord> {
        let (quot, rem) = (len / WORD_LEN, len % WORD_LEN);
        let mut words = vec![!0; quot];
        if rem != 0 {
            words.push((1 << rem) - 1);
        }
        words
    }

    pub fn set_bit(words: &mut [BitWord], index: usize, value: bool) {
        let (quot, rem) = (index / WORD_LEN, index % WORD_LEN);
        if value {
            words[quot] |= 1 << rem;
        } else {
            words[quot] &= !(1 << rem);
        }
    }

    pub fn fmt(words: &[BitWord]) -> String {
        struct Formatter<'a> {
            words: &'a [BitWord],
        }

        impl<'a> fmt::Debug for Formatter<'a> {
            fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
                f.debug_list()
                    .entries(self.words.iter().map(|word| {
                        format!("{:0width$b}", word, width = WORD_LEN)
                            .chars()
                            .rev()
                            .collect::<String>()
                    }))
                    .finish()
            }
        }

        format!("{:?}", Formatter { words })
    }
}
