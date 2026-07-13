---
title: 11 Collections
tier: beginner
platform: rust
---

# 11 Collections

## Goal

Use vectors, strings, and hash maps — the three most common collections.

## Vectors — `Vec<T>`

```rust
fn main() {
    // Create
    let v: Vec<i32> = Vec::new();
    let v = vec![1, 2, 3];
    
    // Update
    let mut v = Vec::new();
    v.push(5);
    v.push(6);
    
    // Read
    let third = &v[2];        // panics if out of bounds
    let third = v.get(2);     // returns Option<&T>
    
    // Iterate
    for i in &v {
        println!("{}", i);
    }
    
    // Mutable iterate
    let mut v = vec![1, 2, 3];
    for i in &mut v {
        *i += 50;
    }
}
```

### Using an Enum to Store Multiple Types

```rust
enum SpreadsheetCell {
    Int(i32),
    Float(f64),
    Text(String),
}

fn main() {
    let row = vec![
        SpreadsheetCell::Int(3),
        SpreadsheetCell::Text(String::from("blue")),
        SpreadsheetCell::Float(10.12),
    ];
}
```

## Strings — `String` and `&str`

```rust
fn main() {
    // Create
    let s = String::new();
    let s = "hello".to_string();
    let s = String::from("hello");
    
    // Update
    let mut s = String::from("foo");
    s.push_str("bar");
    s.push('!');
    
    // Concatenation
    let s1 = String::from("Hello, ");
    let s2 = String::from("world!");
    let s3 = s1 + &s2; // s1 moved, s2 borrowed
    
    // Format
    let s = format!("{}-{}-{}", "tic", "tac", "toe");
}
```

### Indexing Strings

```rust
fn main() {
    let s = String::from("hello");
    // let h = s[0]; // ERROR: no direct indexing
    
    // Bytes
    for b in "hello".bytes() {
        println!("{}", b);
    }
    
    // Chars (Unicode scalar values)
    for c in "नमस्ते".chars() {
        println!("{}", c);
    }
}
```

## Hash Maps — `HashMap<K, V>`

```rust
use std::collections::HashMap;

fn main() {
    let mut scores = HashMap::new();
    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);
    
    // Get
    let team = String::from("Blue");
    let score = scores.get(&team); // Option<&V>
    
    // Iterate
    for (key, value) in &scores {
        println!("{}: {}", key, value);
    }
}
```

### Hash Maps and Ownership

```rust
fn main() {
    let field = String::from("Favorite color");
    let value = String::from("Blue");
    
    let mut map = HashMap::new();
    map.insert(field, value);
    // field and value are moved!
    // println!("{}", field); // ERROR
}
```

### Updating Hash Maps

```rust
fn main() {
    let mut scores = HashMap::new();
    scores.insert(String::from("Blue"), 10);
    
    // Overwrite
    scores.insert(String::from("Blue"), 20);
    
    // Only insert if absent
    scores.entry(String::from("Yellow")).or_insert(50);
    scores.entry(String::from("Blue")).or_insert(50); // won't change
    
    // Update based on old value
    let text = "hello world wonderful world";
    let mut map = HashMap::new();
    for word in text.split_whitespace() {
        let count = map.entry(word).or_insert(0);
        *count += 1;
    }
}
```

## Checkpoint

```rust
use std::collections::HashMap;

fn main() {
    // Word frequency counter
    let text = "the quick brown fox jumps over the lazy dog";
    let mut freq = HashMap::new();
    
    for word in text.split_whitespace() {
        *freq.entry(word).or_insert(0) += 1;
    }
    
    // Print sorted
    let mut words: Vec<_> = freq.keys().collect();
    words.sort();
    
    for word in words {
        println!("{}: {}", word, freq[word]);
    }
}
```

Output:
```
brown: 1
dog: 1
fox: 1
jumps: 1
lazy: 1
over: 1
quick: 1
the: 2
```

## Next

Continue to [Intermediate Tier](../intermediate/).