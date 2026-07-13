---
title: 07 Ownership
tier: beginner
platform: rust
---

# 07 Ownership

## Goal

Understand Rust's core memory management model: ownership, move semantics, and the `Drop` trait.

## What is Ownership?

Rust's central feature — **each value has exactly one owner**. When the owner goes out of scope, the value is dropped.

```rust
fn main() {
    let s = String::from("hello"); // s owns the String
} // s goes out of scope, String is dropped
```

## The Stack vs Heap

- **Stack**: Fixed-size, fast, LIFO (integers, bools, references)
- **Heap**: Dynamic size, slower, managed by allocator (String, Vec, Box)

```rust
fn main() {
    let x = 5;           // on stack
    let y = x;           // copy - x still valid
    
    let s1 = String::from("hello"); // on heap
    let s2 = s1;         // MOVE - s1 no longer valid!
    // println!("{}", s1); // ERROR: borrow of moved value
}
```

## Move Semantics

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1;           // s1 moved to s2
    
    takes_ownership(s2);   // s2 moved to function
    // s2 no longer valid here
}

fn takes_ownership(s: String) {
    println!("Got: {}", s);
} // s dropped here
```

## Clone — Deep Copy

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1.clone();   // deep copy
    
    println!("s1: {}, s2: {}", s1, s2); // both valid
}
```

## Copy Trait — Stack-Only Types

Types implementing `Copy` are copied instead of moved:

```rust
fn main() {
    let x = 5;
    let y = x;             // x copied, both valid
    
    let t = (1, 2);        // tuples of Copy types are Copy
    let u = t;
}
```

Copy types: integers, floats, bool, char, tuples of Copy types.

## Functions and Ownership

```rust
fn main() {
    let s = String::from("hello");
    let len = calculate_length(&s); // borrow
    println!("Length of '{}' is {}", s, len);
}

fn calculate_length(s: &String) -> usize { // borrow
    s.len()
} // s goes out of scope, but doesn't own the value
```

## Return Values and Ownership

```rust
fn main() {
    let s1 = gives_ownership();        // s1 owns returned String
    let s2 = String::from("hello");
    let s3 = takes_and_gives_back(s2); // s2 moved, s3 owns result
}

fn gives_ownership() -> String {
    String::from("yours")
}

fn takes_and_gives_back(s: String) -> String {
    s // ownership transferred back
}
```

## The `Drop` Trait

Code run when a value goes out of scope:

```rust
struct CustomSmartPointer {
    data: String,
}

impl Drop for CustomSmartPointer {
    fn drop(&mut self) {
        println!("Dropping CustomSmartPointer with data `{}`!", self.data);
    }
}

fn main() {
    let c = CustomSmartPointer { data: String::from("my stuff") };
    let d = CustomSmartPointer { data: String::from("other stuff") };
    println!("CustomSmartPointers created.");
} // d dropped, then c dropped (LIFO)
```

Output:
```
CustomSmartPointers created.
Dropping CustomSmartPointer with data `other stuff`!
Dropping CustomSmartPointer with data `my stuff`!
```

### Early Drop with `std::mem::drop`

```rust
fn main() {
    let c = CustomSmartPointer { data: String::from("data") };
    println!("Before drop");
    std::mem::drop(c); // force early drop
    println!("After drop");
}
```

## Ownership Rules Summary

1. Each value has **one** owner at a time
2. When owner goes out of scope, value is dropped
3. Assignment/move transfers ownership
4. `Clone` creates deep copy
5. `Copy` types are implicitly copied

## Checkpoint

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1.clone();
    let s3 = s1;          // s1 moved to s3
    
    let x = 5;
    let y = x;            // x copied
    
    takes_ownership(s3);  // s3 moved
    borrows(&s2);         // s2 borrowed
    println!("x: {}, y: {}", x, y);
    println!("s2: {}", s2);
}

fn takes_ownership(s: String) {
    println!("Owned: {}", s);
}

fn borrows(s: &String) {
    println!("Borrowed: {}", s);
}
```

Output:
```
Owned: hello
Borrowed: hello
x: 5, y: 5
s2: hello
```

## Next

Continue to [08 References and Borrowing](./08-references-and-borrowing).