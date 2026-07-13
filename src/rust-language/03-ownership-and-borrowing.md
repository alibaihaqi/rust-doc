---
title: 03 Ownership and Borrowing
tier: rust-language
platform: rust
---

# 03 Ownership and Borrowing

## Goal

Master Rust's memory management model: ownership, moves, borrows, and lifetimes.

## Ownership Rules

1. Each value has a single owner
2. When owner goes out of scope, value is dropped
3. Assignment/parameter passing transfers ownership (move)

## Move Semantics

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1; // s1 moved to s2
    
    // println!("{}", s1); // ERROR: value moved
    println!("{}", s2); // OK
}
```

### Function Ownership

```rust
fn take_ownership(s: String) {
    println!("{}", s);
} // s dropped here

fn main() {
    let s = String::from("hello");
    take_ownership(s);
    // s no longer valid
}
```

### Return Ownership

```rust
fn gives_ownership() -> String {
    String::from("hello")
}

fn takes_and_gives_back(s: String) -> String {
    s
}

fn main() {
    let s1 = gives_ownership();
    let s2 = String::from("hello");
    let s3 = takes_and_gives_back(s2);
}
```

## References and Borrowing

```rust
fn main() {
    let s1 = String::from("hello");
    let len = calculate_length(&s1); // borrow
    println!("{} {}", s1, len); // s1 still valid
}

fn calculate_length(s: &String) -> usize {
    s.len()
} // s goes out of scope, but doesn't drop String
```

### Mutable References

```rust
fn main() {
    let mut s = String::from("hello");
    change(&mut s); // mutable borrow
    println!("{}", s); // "hello, world"
}

fn change(s: &mut String) {
    s.push_str(", world");
}
```

## Borrowing Rules

At any given time, you can have **either**:
- One mutable reference (`&mut T`), OR
- Any number of immutable references (`&T`)

References must always be valid (no dangling references).

```rust
let mut s = String::from("hello");

let r1 = &s; // OK
let r2 = &s; // OK
// let r3 = &mut s; // ERROR: cannot borrow mutably

let r3 = &mut s; // OK
// let r4 = &s; // ERROR: cannot borrow immutably
```

## Slices

```rust
let s = String::from("hello world");
let hello = &s[0..5];  // "hello"
let world = &s[6..11]; // "world"

let slice = &s[..];    // entire string
let slice = &s[0..];   // from start
let slice = &s[..5];   // to index 5
```

### String Slices as Parameters

```rust
fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }
    &s[..]
}
```

## NLL — Non-Lexical Lifetimes

Borrow checker uses actual scope, not lexical scope:

```rust
fn main() {
    let mut s = String::from("hello");
    
    let r1 = &s;
    let r2 = &s;
    println!("{} {}", r1, r2);
    // r1, r2 scope ends here (last use)
    
    let r3 = &mut s; // OK! r1, r2 no longer used
    println!("{}", r3);
}
```

## Copy vs Move

```rust
// Types with Copy trait: move is actually copy
let x = 5;
let y = x; // x still valid! i32 implements Copy

// Types without Copy: move
let s1 = String::from("hello");
let s2 = s1; // s1 invalidated
```

### Types that implement Copy

- All integer types
- Boolean
- Floating point
- Character
- Tuples of Copy types
- Shared references `&T`

### Types that don't (Move)

- String
- Vec
- HashMap
- Box
- Any type with custom Drop

## Checkpoint

```rust
fn main() {
    let s = String::from("hello");
    let len = length(&s);
    println!("'{}' length: {}", s, len);
    
    let mut s = String::from("hello");
    append_world(&mut s);
    println!("{}", s); // "hello world"
    
    let s = String::from("hello world");
    let word = first_word(&s);
    println!("First word: {}", word);
}

fn length(s: &String) -> usize {
    s.len()
}

fn append_world(s: &mut String) {
    s.push_str(" world");
}

fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }
    &s[..]
}
```

Output:
```
'hello' length: 5
hello world
First word: hello
```

## Next

Continue to [04 Structs and Enums](./04-structs-and-enums).