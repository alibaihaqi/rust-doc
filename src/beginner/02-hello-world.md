---
title: 02 Hello World
tier: beginner
platform: rust
---

# 02 Hello World

## Goal

Understand the basic structure of a Rust program and the `println!` macro.

## Steps

### 1. Create Project

```bash
cargo new hello_world
cd hello_world
```

### 2. Examine `src/main.rs`

```rust
fn main() {
    println!("Hello, world!");
}
```

Key points:
- `fn main()` - entry point, no args, no return
- `println!` - macro (note `!`), prints to stdout with newline

### 3. Run

```bash
cargo run
```

Output:
```
Hello, world!
```

### 4. Build for Release

```bash
cargo build --release
./target/release/hello_world
```

## Checkpoint

Create a program that prints your name:

```rust
fn main() {
    println!("Hello, Alice!");
}
```

Run with `cargo run` - should output `Hello, Alice!`

## Next

Continue to [03 Variables and Mutability](./03-variables-and-mutability).