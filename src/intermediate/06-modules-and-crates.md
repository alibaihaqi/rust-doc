---
title: 06 Modules and Crates
tier: intermediate
platform: rust
---

# 06 Modules and Crates

## Goal

Organize code with modules, control visibility with `pub`, and manage dependencies with Cargo workspaces.

## Modules

```rust
// src/lib.rs or src/main.rs
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
        fn seat_at_table() {}
    }
    
    mod serving {
        fn take_order() {}
        fn serve_order() {}
        fn take_payment() {}
    }
}
```

### Module Tree

```
crate
 └── front_of_house
     ├── hosting
     │   ├── add_to_waitlist (pub)
     │   └── seat_at_table
     └── serving
         ├── take_order
         ├── serve_order
         └── take_payment
```

## Paths

```rust
// Absolute path from crate root
crate::front_of_house::hosting::add_to_waitlist();

// Relative path from current module
front_of_house::hosting::add_to_waitlist();

// Using self
self::front_of_house::hosting::add_to_waitlist();

// Using super
super::front_of_house::hosting::add_to_waitlist();
```

## `use` Declarations

```rust
use crate::front_of_house::hosting;

fn eat_at_restaurant() {
    hosting::add_to_waitlist();
}

// Idiomatic: import function's parent module
use crate::front_of_house::hosting::add_to_waitlist;

fn eat_at_restaurant() {
    add_to_waitlist();
}

// Re-export with pub use
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

pub use crate::front_of_house::hosting; // Re-export for consumers
```

## Multiple Paths

```rust
use std::cmp::Ordering;
use std::io;
// or
use std::{cmp::Ordering, io};

// Nested paths
use std::io::{self, Write, Read};

// Glob operator (use sparingly)
use std::collections::*;
```

## Separating Modules into Files

```
src/
├── main.rs
├── lib.rs
├── front_of_house.rs
└── front_of_house/
    ├── hosting.rs
    └── serving.rs
```

```rust
// src/lib.rs
mod front_of_house; // loads front_of_house.rs or front_of_house/mod.rs

// src/front_of_house.rs
pub mod hosting;
mod serving;

// src/front_of_house/hosting.rs
pub fn add_to_waitlist() {}
```

## Crates

- **Binary crate** — `src/main.rs` → executable
- **Library crate** — `src/lib.rs` → reusable library

```
my_project/
├── Cargo.toml
├── src/
│   ├── main.rs      # binary
│   └── lib.rs       # library
```

## Cargo Workspaces

```
workspace/
├── Cargo.toml          # [workspace] members = ["adder", "calculator"]
├── adder/
│   ├── Cargo.toml
│   └── src/lib.rs
└── calculator/
    ├── Cargo.toml
    └── src/lib.rs
```

```toml
# workspace/Cargo.toml
[workspace]
members = ["adder", "calculator"]
resolver = "2"

[workspace.dependencies]
serde = { version = "1.0", features = ["derive"] }
```

```toml
# adder/Cargo.toml
[package]
name = "adder"
version = "0.1.0"
edition = "2021"

[dependencies]
calculator = { path = "../calculator" }
serde = { workspace = true }
```

## `pub` Visibility

```rust
mod outer {
    pub fn public_fn() {}
    fn private_fn() {}
    
    mod inner {
        pub fn inner_public() {}
        fn inner_private() {}
        
        // Visible to parent module
        pub(super) fn visible_to_parent() {}
        // Visible to crate
        pub(crate) fn visible_to_crate() {}
        // Visible to specific path
        pub(in crate::outer) fn visible_to_outer() {}
    }
}
```

## Testing Private Functions

```rust
// In the same module or child module
mod tests {
    use super::*;
    
    #[test]
    fn test_private() {
        assert_eq!(private_fn(), 42);
    }
}
```

## Checkpoint

```
src/
├── main.rs
├── lib.rs
├── garden/
│   ├── mod.rs
│   ├── vegetables.rs
│   └── fruits.rs
```

```rust
// lib.rs
pub mod garden;

// garden/mod.rs
pub mod vegetables;
pub mod fruits;

// garden/vegetables.rs
pub struct Carrot;
pub fn plant_carrot() -> Carrot { Carrot }

// garden/fruits.rs
pub struct Apple;
pub fn plant_apple() -> Apple { Apple }
```

```rust
// main.rs
use garden::{vegetables, fruits};

fn main() {
    let _ = vegetables::plant_carrot();
    let _ = fruits::plant_apple();
}
```

## Next

Continue to [07 Automated Tests](./07-automated-tests).