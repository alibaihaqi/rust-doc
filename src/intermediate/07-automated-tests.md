---
title: 07 Automated Tests
tier: intermediate
platform: rust
---

# 07 Automated Tests

## Goal

Write unit tests, integration tests, and documentation tests. Organize tests effectively and use test attributes.

## Test Organization

```
src/
├── lib.rs          # library code + unit tests
└── tests/
    └── integration_test.rs  # integration tests
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
        divide(10, 0);
    }
}
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

Run specific test file:
```bash
cargo test --test integration_test
```

## Documentation Tests

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

## Test Attributes

| Attribute | Purpose |
|-----------|---------|
| `#[test]` | Mark function as test |
| `#[ignore]` | Skip test by default |
| `#[should_panic]` | Expect panic |
| `#[should_panic(expected = "msg")]` | Expect panic with message |
| `#[cfg(test)]` | Compile only for tests |

## Running Tests

```bash
# All tests
cargo test

# Specific test
cargo test test_add

# With output
cargo test -- --nocapture

# Single thread
cargo test -- --test-threads=1

# List tests
cargo test -- --list
```

## Test Modules

```rust
#[cfg(test)]
mod tests {
    // Helper not exported
    fn setup() -> TestData { ... }
    
    #[test]
    fn test_something() {
        let data = setup();
        // ...
    }
    
    #[test]
    #[ignore]
    fn expensive_test() { ... }
}
```

## Testing Private Code

```rust
// In same module or child module
mod tests {
    use super::*;
    
    #[test]
    fn test_private_fn() {
        assert_eq!(private_helper(5), 10);
    }
}

fn private_helper(x: i32) -> i32 { x * 2 }
```

## Mocking with Traits

```rust
trait Database {
    fn get_user(&self, id: u64) -> Option<User>;
}

struct RealDB;
impl Database for RealDB { ... }

struct MockDB { users: HashMap<u64, User> }
impl Database for MockDB { ... }

fn process_user<D: Database>(db: &D, id: u64) { ... }

#[test]
fn test_process_user() {
    let mut mock = MockDB::new();
    mock.users.insert(1, User::new("Alice"));
    process_user(&mock, 1);
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
    fn test_add_commutative(a in any::<i32>(), b in any::<i32>()) {
        prop_assert_eq!(add(a, b), add(b, a));
    }
}
```

## Benchmarks

```rust
#![feature(test)]
extern crate test;

#[bench]
fn bench_add(b: &mut test::Bencher) {
    b.iter(|| add(2, 3));
}
```

Run: `cargo bench`

## Code Coverage

```bash
# Install
cargo install cargo-llvm-cov

# Run
cargo llvm-cov --html
```

## Checkpoint

```rust
// src/lib.rs
pub struct Calculator;

impl Calculator {
    pub fn add(&self, a: i32, b: i32) -> i32 { a + b }
    pub fn divide(&self, a: i32, b: i32) -> Result<i32, String> {
        if b == 0 { Err("division by zero".into()) } else { Ok(a / b) }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_add() {
        let calc = Calculator;
        assert_eq!(calc.add(2, 3), 5);
    }
    
    #[test]
    fn test_divide() {
        let calc = Calculator;
        assert_eq!(calc.divide(10, 2), Ok(5));
    }
    
    #[test]
    #[should_panic(expected = "division by zero")]
    fn test_divide_by_zero() {
        let calc = Calculator;
        calc.divide(10, 0).unwrap();
    }
}
```

Run:
```bash
cargo test
```

Output:
```
running 3 tests
test tests::test_add ... ok
test tests::test_divide ... ok
test tests::test_divide_by_zero ... ok

test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out
```

## Next

You've completed the **Intermediate** tier! Continue to [Advanced Tier](../advanced/) for async, concurrency, unsafe, macros, FFI, and performance tuning.