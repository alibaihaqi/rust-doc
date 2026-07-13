---
title: 01 Why Rust
tier: rust-language
platform: rust
---

# 01 Why Rust

## Goal

Understand Rust's design philosophy, guarantees, and where it excels.

## The Core Promise

**Memory safety without garbage collection.**

Rust achieves this through:
- **Ownership** - each value has exactly one owner
- **Borrowing** - references are tracked at compile time
- **Lifetimes** - references can't outlive their data

## What You Get

| Guarantee | How |
|-----------|-----|
| No null pointer deref | `Option<T>` instead of null |
| No double free | Ownership + `Drop` |
| No use-after-free | Borrow checker |
| No data races | `Send`/`Sync` + borrow checker |
| No buffer overflow | Bounds checking |

## Zero-Cost Abstractions

> "What you don't use, you don't pay for. What you do use, you couldn't hand-code better." — Bjarne Stroustrup

- Generics monomorphized at compile time
- Iterators optimize to raw loops
- `async`/`await` compiles to state machines

## Where Rust Shines

- **Systems programming** - OS, drivers, embedded
- **Web services** - high throughput, low latency
- **CLI tools** - fast startup, single binary
- **WebAssembly** - no runtime, small size
- **Blockchain** - deterministic execution
- **Game engines** - predictable frame times

## When NOT to Use Rust

- Rapid prototyping (Python, JS faster to iterate)
- Heavy GUI (ecosystem still maturing)
- Data science (Python ecosystem unmatched)
- Team with no systems experience (steep learning curve)

## Checkpoint

```rust
// This won't compile - use after move
fn main() {
    let s = String::from("hello");
    let s2 = s;        // s moved to s2
    println!("{}", s); // ERROR: value borrowed after move
}

// This won't compile - mutable aliasing
fn main() {
    let mut s = String::from("hello");
    let r1 = &mut s;
    let r2 = &mut s;   // ERROR: cannot borrow twice mutably
    println!("{}, {}", r1, r2);
}

// This IS safe - compiler enforces at compile time
fn main() {
    let mut s = String::from("hello");
    {
        let r1 = &mut s; // scope ends here
    }
    let r2 = &mut s;     // OK - r1 dropped
}
```

## Next

Continue to [02 Variables and Types](./02-variables-and-types).