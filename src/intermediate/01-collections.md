---
title: 01 Collections Deep Dive
tier: intermediate
platform: rust
---

# 01 Collections Deep Dive

## Goal

Master the standard library collections: when to use each, performance characteristics, and common patterns.

## Vector - `Vec<T>`

```rust
fn main() {
    // Capacity management
    let mut v = Vec::with_capacity(100);
    for i in 0..100 {
        v.push(i); // no reallocation
    }
    
    // Drain - take ownership of elements
    let mut v = vec![1, 2, 3, 4, 5];
    let drained: Vec<_> = v.drain(1..4).collect(); // [2, 3, 4]
    // v is now [1, 5]
    
    // Split off
    let mut v = vec![1, 2, 3, 4, 5];
    let tail = v.split_off(2); // v=[1,2], tail=[3,4,5]
}
```

## HashMap - `HashMap<K, V>`

```rust
use std::collections::HashMap;

fn main() {
    // Entry API - efficient upsert
    let mut map = HashMap::new();
    map.entry("key").or_insert(0);
    
    // Custom hasher for performance/security
    use std::hash::BuildHasherDefault;
    use std::collections::hash_map::RandomState;
    let map: HashMap<_, _, BuildHasherDefault<RandomState>> = HashMap::default();
    
    // Raw entry API (nightly) - avoid double hashing
}
```

## HashSet and BTreeSet

```rust
use std::collections::{HashSet, BTreeSet};

fn main() {
    // HashSet - O(1) operations, unordered
    let mut set = HashSet::new();
    set.insert(1);
    set.insert(2);
    
    // BTreeSet - O(log n), ordered
    let mut set = BTreeSet::new();
    set.insert(3);
    set.insert(1);
    // Iteration yields 1, 2, 3
    
    // Set operations
    let a: HashSet<_> = [1, 2, 3].into();
    let b: HashSet<_> = [2, 3, 4].into();
    
    println!("Union: {:?}", a.union(&b).collect::<Vec<_>>());
    println!("Intersection: {:?}", a.intersection(&b).collect::<Vec<_>>());
    println!("Difference: {:?}", a.difference(&b).collect::<Vec<_>>());
}
```

## Performance Comparison

| Operation | `Vec` | `HashMap` | `BTreeMap` |
|-----------|-------|-----------|------------|
| Insert | O(1)* | O(1)* | O(log n) |
| Lookup | O(n) | O(1)* | O(log n) |
| Ordered iteration | O(n) | O(n) | O(n) |
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

fn main() {
    let items = vec!["a".into(), "b".into(), "a".into(), "c".into(), "b".into()];
    println!("Duplicates: {:?}", find_duplicates(&items));
}
```

## Next

Continue to [02 Error Handling](./02-error-handling).