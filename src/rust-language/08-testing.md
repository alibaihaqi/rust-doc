---
title: 08 Testing
tier: rust-language
platform: rust
---

# 08 Testing

## Goal

Write unit tests, integration tests, doc tests, and benchmarks. Organize tests effectively.

## Test Organization

```
src/
├── lib.rs          # Library code + unit tests
└── tests/
    ├── integration_test.rs
    └── common/
        └── mod.rs  # Shared test helpers
```

## Unit Tests

```rust
// src/lib.rs
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_add() {
        assert_eq!(add(2, 3), 5);
    }
    
    #[test]
    fn test_add_negative() {
        assert_eq!(add(-1, 1), 0);
    }
}
```

### Test Assertions

```rust
#[test]
fn assertions() {
    // Equality
    assert_eq!(2 + 2, 4);
    assert_ne!(2 + 2, 5);
    
    // Boolean
    assert!(true);
    assert!(!false);
    
    // Panic
    #[should_panic(expected = "divide by zero")]
    fn test_divide_by_zero() {
        panic!("divide by zero");
    }
    
    // Custom message
    assert_eq!(add(2, 2), 4, "Addition failed: 2+2 should be 4");
}
```

### Test Attributes

```rust
#[test]
fn normal_test() { ... }

#[test]
#[ignore] // Run with `cargo test -- --ignored`
fn expensive_test() { ... }

#[test]
#[should_panic]
fn test_panic() { ... }

// Conditional compilation
#[cfg(test)]
mod tests { ... }
```

## Integration Tests

```rust
// tests/integration_test.rs
use my_crate::add;

#[test]
fn test_add_integration() {
    assert_eq!(add(2, 3), 5);
}
```

Run: `cargo test --test integration_test`

## Doc Tests

```rust
/// Adds two numbers.
/// 
/// # Examples
/// 
/// ```
/// let result = my_crate::add(2, 3);
/// assert_eq!(result, 5);
/// ```
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

Run: `cargo test --doc`

### Hidden Examples

```rust
/// ```
/// # // hidden setup
/// let x = 5;
/// assert_eq!(x, 5);
/// ```
```

## Test Helpers

```rust
// tests/common/mod.rs
pub fn setup() {
    // Common setup
    env_logger::init();
}
```

```rust
// tests/integration_test.rs
mod common;

#[test]
fn test_with_setup() {
    common::setup();
    // ...
}
```

## Property-Based Testing

```toml
# Cargo.toml
[dev-dependencies]
proptest = "1.0"
```

```rust
use proptest::prelude::*;

proptest! {
    #[test]
    fn add_is_commutative(a in any::<i32>(), b in any::<i32>()) {
        assert_eq!(add(a, b), add(b, a));
    }
    
    #[test]
    fn add_identity(a in any::<i32>()) {
        assert_eq!(add(a, 0), a);
    }
}
```

## Benchmarks

```toml
# Cargo.toml
[dev-dependencies]
criterion = "0.5"

[[bench]]
name = "my_bench"
harness = false
```

```rust
// benches/my_bench.rs
use criterion::{black_box, criterion_group, criterion_main, Criterion};
use my_crate::add;

fn bench_add(c: &mut Criterion) {
    c.bench_function("add 1+2", |b| b.iter(|| add(black_box(1), black_box(2))));
}

criterion_group!(benches, bench_add);
criterion_main!(benches);
```

Run: `cargo bench`

## Running Tests

```bash
# All tests
cargo test

# Specific test
cargo test test_add

# Filter
cargo test add

# With output
cargo test -- --nocapture

# Ignored tests
cargo test -- --ignored

# Integration tests only
cargo test --test integration_test

# Doc tests
cargo test --doc

# Specific package in workspace
cargo test -p my_crate
```

## Test Coverage

```bash
# Install
cargo install cargo-llvm-cov

# Run
cargo llvm-cov --html

# With specific test
cargo llvm-cov --html --test integration_test
```

## Checkpoint

```rust
// src/calculator.rs
pub struct Calculator;

impl Calculator {
    pub fn add(&self, a: i32, b: i32) -> i32 { a + b }
    pub fn div(&self, a: i32, b: i32) -> Result<i32, String> {
        if b == 0 { Err("Division by zero".into()) }
        else { Ok(a / b) }
    }
}

// src/calculator.rs (tests module)
#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn add_works() {
        let calc = Calculator;
        assert_eq!(calc.add(2, 3), 5);
    }
    
    #[test]
    fn div_works() {
        let calc = Calculator;
        assert_eq!(calc.div(10, 2), Ok(5));
    }
    
    #[test]
    fn div_by_zero() {
        let calc = Calculator;
        assert_eq!(calc.div(10, 0), Err("Division by zero".into()));
    }
}

// tests/calculator_integration.rs
use my_crate::Calculator;

#[test]
fn integration_test() {
    let calc = Calculator;
    assert_eq!(calc.add(100, 200), 300);
}
```

Run:
```bash
cargo test
```

Output:
```
running 3 tests
test tests::add_works ... ok
test tests::div_works ... ok
test tests::div_by_zero ... ok

running 1 test
test integration_test ... ok

running 0 tests
```

## Next

Continue to [09 Concurrency](./09-concurrency).