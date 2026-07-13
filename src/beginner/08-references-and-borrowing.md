---
title: 08 References and Borrowing
tier: beginner
platform: rust
---

# 08 References and Borrowing

## Goal

Master references (`&T`, `&mut T`), borrowing rules, and the borrow checker that enforces memory safety at compile time.

## References

A **reference** lets you refer to a value without taking ownership:

```rust
fn main() {
    let s1 = String::from("hello");
    let len = calculate_length(&s1); // &s1 = reference to s1
    println!("Length of '{}' is {}.", s1, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
} // s goes out of scope, but doesn't drop what it refers to
```

## Mutable References

```rust
fn main() {
    let mut s = String::from("hello");
    change(&mut s);
    println!("{}", s); // "hello, world"
}

fn change(s: &mut String) {
    s.push_str(", world");
}
```

## The Borrowing Rules

Rust enforces these rules **at compile time**:

1. **At any time**, you can have **either**:
   - One mutable reference (`&mut T`), **OR**
   - Any number of immutable references (`&T`)

2. **References must always be valid** (no dangling references)

### Rule 1: No Multiple Mutable References

```rust
fn main() {
    let mut s = String::from("hello");
    let r1 = &mut s;
    let r2 = &mut s; // ERROR: cannot borrow `s` as mutable more than once
    println!("{}, {}", r1, r2);
}
```

### Rule 2: Mutable and Immutable Can't Coexist

```rust
fn main() {
    let mut s = String::from("hello");
    let r1 = &s;       // immutable borrow
    let r2 = &s;       // immutable borrow OK
    let r3 = &mut s;   // ERROR: cannot borrow `s` as mutable
    println!("{}, {}, {}", r1, r2, r3);
}
```

### Rule 3: Scope Ends Borrows

```rust
fn main() {
    let mut s = String::from("hello");
    
    { // new scope
        let r1 = &mut s; // OK
    } // r1 goes out of scope here
    
    let r2 = &mut s; // OK - r1 no longer valid
}
```

## Slices

A **slice** references a contiguous sequence in a collection.

```rust
fn main() {
    let s = String::from("hello world");
    let hello = &s[0..5];
    let world = &s[6..11];
    println!("{} {}", hello, world); // "hello world"
    
    // Range syntax shortcuts
    let slice = &s[..5];  // from start to index 5
    let slice = &s[6..];  // from index 6 to end
    let slice = &s[..];   // entire string
}
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

fn main() {
    let s = String::from("hello world");
    let word = first_word(&s);      // &String coerces to &str
    println!("First word: {}", word);
    
    // Works with string literals too (&str directly)
    let literal = "hello world";
    let word = first_word(literal);
}
```

### Array Slices

```rust
fn main() {
    let arr = [1, 2, 3, 4, 5];
    let slice = &arr[1..3]; // &[2, 3]
    println!("{:?}", slice);
}
```

## The Borrow Checker

The compiler's **borrow checker** enforces these rules statically:

| Borrow Type | Notation | Multiple Allowed? | Can Mutate? |
|-------------|----------|-------------------|-------------|
| Immutable | `&T` | Yes | No |
| Mutable | `&mut T` | No (one at a time) | Yes |

## Dangling References (Prevented)

```rust
fn main() {
    let reference = dangle();
}

fn dangle() -> &String {
    let s = String::from("hello");
    &s // ERROR: returns reference to dropped value
}
```

Error:
```
error[E0106]: missing lifetime specifier
 --> src/main.rs:6:5
  |
6 |     &s
  |     ^^ returns a reference to data owned by the current function
```

## Checkpoint

```rust
fn main() {
    let mut data = vec![1, 2, 3];
    
    // Multiple immutable borrows OK
    let r1 = &data;
    let r2 = &data;
    println!("r1: {:?}, r2: {:?}", r1, r2);
    
    // Mutable borrow exclusive
    let r3 = &mut data;
    r3.push(4);
    println!("r3: {:?}", r3);
    
    // Slice
    let slice = &data[1..3];
    println!("slice: {:?}", slice);
    
    // Function borrows
    print_first(&data);
}

fn print_first(v: &Vec<i32>) {
    if let Some(first) = v.first() {
        println!("First: {}", first);
    }
}
```

Output:
```
r1: [1, 2, 3], r2: [1, 2, 3]
r3: [1, 2, 3, 4]
slice: [2, 3]
First: 1
```

## Next

Continue to [09 Structs](./09-structs).