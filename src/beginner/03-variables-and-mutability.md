---
title: 03 Variables and Mutability
tier: beginner
platform: rust
---

# 03 Variables and Mutability

## Goal

Learn how Rust handles variables, immutability by default, and the `mut` keyword.

## Steps

### 1. Immutable by Default

```rust
fn main() {
    let x = 5;
    println!("x = {}", x);
    // x = 6; // error: cannot assign twice to immutable variable
}
```

### 2. Make Mutable with `mut`

```rust
fn main() {
    let mut x = 5;
    println!("x = {}", x);
    x = 6;
    println!("x = {}", x);
}
```

### 3. Constants

```rust
const MAX_POINTS: u32 = 100_000;

fn main() {
    println!("Max: {}", MAX_POINTS);
}
```

Rules:
- Always immutable
- Type annotation required
- Can be declared in any scope
- Naming: `UPPER_SNAKE_CASE`

### 4. Shadowing

```rust
fn main() {
    let x = 5;
    let x = x + 1;
    let x = x * 2;
    println!("x = {}", x); // 12
}
```

Shadowing vs `mut`:
- Creates new variable
- Can change type
- `mut` mutates in place

## Checkpoint

```rust
fn main() {
    let mut counter = 0;
    counter = counter + 1;
    
    const MAX: u32 = 10;
    
    let spaces = "   ";
    let spaces = spaces.len(); // shadowing changes type
    
    println!("counter: {}, MAX: {}, spaces: {}", counter, MAX, spaces);
}
```

Output: `counter: 1, MAX: 10, spaces: 3`

## Next

Continue to [04 Data Types](./04-data-types).