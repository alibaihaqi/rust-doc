---
title: 01 Collections Deep Dive
tier: intermediate
platform: rust
---

# 01 Collections Deep Dive

## Goal

Master the standard library collections: when to use each, performance characteristics, and common patterns.

## Vector — `Vec<T>`

### Capacity Management

```rust
fn main() {
    // Pre-allocate to avoid reallocations
    let mut v = Vec::with_capacity(100);
    for i in 0..100 {
        v.push(i); // no reallocation
    }
    
    // Shrink to fit
    v.shrink_to_fit();
}
```

### Drain and Split Off

```rust
fn main() {
    let mut v = vec![1, 2, 3, 4, 5];
    
    // Take ownership of a range
    let drained: Vec<_> = v.drain(1..4).collect(); // [2, 3, 4]
    // v is now [1, 5]
    
    // Split off tail
    let mut v = vec![1, 2, 3, 4, 5];
    let tail = v.split_off(2); // v=[1,2], tail=[3,4,5]
}
```

### Retain

```rust
fn main() {
    let mut v = vec![1, 2, 3, 4, 5, 6];
    v.retain(|x| x % 2 == 0); // [2, 4, 6]
}
```

## HashMap — `HashMap<K, V>`

### Entry API — Efficient Upsert

```rust
use std::collections::HashMap;

fn main() {
    let mut map = HashMap::new();
    
    // Insert or update in one lookup
    *map.entry("key").or_insert(0) += 1;
    
    // Or insert with default
    map.entry("new").or_insert_with(|| expensive_computation());
    
    // Modify existing
    if let Some(v) = map.get_mut("key") {
        *v += 10;
    }
}

fn expensive_computation() -> i32 { 42 }
```

### Custom Hasher

```rust
use std::collections::HashMap;
use std::hash::BuildHasherDefault;
use std::hash::Hasher;

// Fast hasher for trusted data
#[derive(Default)]
struct FastHasher(u64);

impl Hasher for FastHasher {
    fn finish(&self) -> u64 { self.0 }
    fn write(&mut self, bytes: &[u8]) {
        for &b in bytes { self.0 = self.0.wrapping_mul(31).wrapping_add(b as u64); }
    }
}

type FastMap<K, V> = HashMap<K, V, BuildHasherDefault<FastHasher>>;
```

## HashSet and BTreeSet

```rust
use std::collections::{HashSet, BTreeSet};

fn main() {
    // HashSet - O(1) average, unordered
    let mut set = HashSet::new();
    set.insert(1);
    set.insert(2);
    
    // BTreeSet - O(log n), ordered
    let mut btree = BTreeSet::new();
    btree.insert(3);
    btree.insert(1);
    btree.insert(2);
    // Iteration yields 1, 2, 3
    
    // Set operations
    let a: HashSet<_> = [1, 2, 3].into();
    let b: HashSet<_> = [2, 3, 4].into();
    
    println!("Union: {:?}", a.union(&b).collect::<Vec<_>>());
    println!("Intersection: {:?}", a.intersection(&b).collect::<Vec<_>>());
    println!("Difference: {:?}", a.difference(&b).collect::<Vec<_>>());
    println!("Symmetric diff: {:?}", a.symmetric_difference(&b).collect::<Vec<_>>());
}
```

## BTreeMap — Ordered Map

```rust
use std::collections::BTreeMap;

fn main() {
    let mut map = BTreeMap::new();
    map.insert(3, "c");
    map.insert(1, "a");
    map.insert(2, "b");
    
    // Range queries
    for (k, v) in map.range(1..3) {
        println!("{}: {}", k, v);
    }
    
    // First/last entry
    println!("First: {:?}", map.first_key_value());
    println!("Last: {:?}", map.last_key_value());
    
    // Pop first/last
    map.pop_first();
    map.pop_last();
}
```

## Performance Comparison

| Operation | `Vec` | `HashMap` | `BTreeMap` |
|-----------|-------|-----------|------------|
| Insert | O(1)* | O(1)* | O(log n) |
| Lookup | O(n) | O(1)* | O(log n) |
| Ordered iteration | O(n) | O(n) | O(n) |
| Range query | O(n) | O(n) | O(log n + k) |
| Memory | Low | Medium | High |

*Amortized / average case

## Checkpoint

```rust
use std::collections::{HashMap, HashSet};

fn find_duplicates(items: &[String]) -> Vec<String> {
    let mut seen = HashSet::new();
    let mut duplicates = HashSet::new();
    
    for item in items {
        if !seen.insert(item) {
            duplicates.insert(item.clone());
        }
    }
    
    duplicates.into_iter().collect()
}

fn word_frequency(text: &str) -> HashMap<String, usize> {
    let mut freq = HashMap::new();
    for word in text.split_whitespace() {
        *freq.entry(word.to_lowercase()).or_insert(0) += 1;
    }
    freq
}

fn main() {
    let items = vec!["a".into(), "b".into(), "a".into(), "c".into()];
    println!("Duplicates: {:?}", find_duplicates(&items));
    
    let text = "hello world hello rust";
    println!("Frequency: {:?}", word_frequency(text));
}
```

Output:
```
Duplicates: ["a"]
Frequency: {"hello": 2, "world": 1, "rust": 1}
```

## Next

Continue to [02 Error Handling](./02-error-handling).