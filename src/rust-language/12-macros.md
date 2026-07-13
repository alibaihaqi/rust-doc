---
title: 12 Macros
tier: rust-language
platform: rust
---

# 12 Macros

## Goal

Write declarative macros with `macro_rules!` and procedural macros for code generation.

## Declarative Macros — `macro_rules!`

```rust
macro_rules! vec {
    // Empty
    () => { Vec::new() };
    
    // With elements
    ($($x:expr),+ $(,)?) => {{
        let mut v = Vec::new();
        $(v.push($x);)+
        v
    }};
}

fn main() {
    let v = vec![1, 2, 3];
    let empty = vec![];
}
```

### Matchers

| Fragment | Matches |
|----------|---------|
| `expr` | Expression |
| `ty` | Type |
| `path` | Path (e.g., `foo::bar`) |
| `ident` | Identifier |
| `literal` | Literal (e.g., `"hello"`, `42`) |
| `tt` | Token tree (any single token) |
| `block` | Block `{ ... }` |
| `stmt` | Statement |

### Repetition

```rust
// Zero or more: $(...) *
// One or more: $(...) +
// Comma separated zero+: $(...),*
// Comma separated one+: $(...),+

macro_rules! hashmap {
    ($($key:expr => $val:expr),+ $(,)?) => {{
        let mut map = std::collections::HashMap::new();
        $(map.insert($key, $val);)+
        map
    }};
}

let m = hashmap! { "a" => 1, "b" => 2 };
```

### Multiple Arms

```rust
macro_rules! calculate {
    ($a:expr + $b:expr) => { $a + $b };
    ($a:expr - $b:expr) => { $a - $b };
    ($a:expr * $b:expr) => { $a * $b };
    ($a:expr / $b:expr) => { $a / $b };
}

let result = calculate!(10 + 5); // 15
```

### Hygiene

Macros are **hygienic** — variables don't leak:

```rust
macro_rules! create_var {
    () => {
        let x = 42;
    };
}

fn main() {
    create_var!();
    // println!("{}", x); // ERROR: x not in scope
}
```

### Non-hygienic with `$crate`

```rust
#[macro_export]
macro_rules! my_macro {
    () => {
        $crate::internal_fn()
    };
}
```

## Procedural Macros

Procedural macros operate on `TokenStream` at compile time.

### Three Types

| Type | Use Case | Example |
|------|----------|---------|
| **Derive** | `#[derive(Trait)]` | `#[derive(Debug)]` |
| **Attribute** | `#[attr]` on items | `#[tokio::main]` |
| **Function-like** | `macro!(...)` | `sqlx::query!("SELECT *")` |

### Crate Structure

```
my_macros/
├── Cargo.toml
└── src/
    ├── lib.rs
    └── derive.rs
```

```toml
# Cargo.toml
[lib]
proc-macro = true

[dependencies]
syn = "2.0"
quote = "1.0"
proc-macro2 = "1.0"
```

### Derive Macro

```rust
// src/derive.rs
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, DeriveInput};

#[proc_macro_derive(HelloWorld)]
pub fn hello_world_derive(input: TokenStream) -> TokenStream {
    let input = parse_macro_input!(input as DeriveInput);
    let name = &input.ident;
    
    let expanded = quote! {
        impl #name {
            fn hello_world(&self) {
                println!("Hello from {}!", stringify!(#name));
            }
        }
    };
    
    TokenStream::from(expanded)
}
```

Usage:
```rust
use my_macros::HelloWorld;

#[derive(HelloWorld)]
struct MyStruct;

fn main() {
    MyStruct.hello_world(); // "Hello from MyStruct!"
}
```

### Attribute Macro

```rust
// src/attr.rs
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, ItemFn};

#[proc_macro_attribute]
pub fn log_calls(_attr: TokenStream, item: TokenStream) -> TokenStream {
    let input = parse_macro_input!(item as ItemFn);
    let name = &input.sig.ident;
    let body = &input.block;
    
    let expanded = quote! {
        fn #name() {
            println!("Entering {}", stringify!(#name));
            #body
            println!("Exiting {}", stringify!(#name));
        }
    };
    
    TokenStream::from(expanded)
}
```

Usage:
```rust
use my_macros::log_calls;

#[log_calls]
fn my_function() {
    println!("Inside function");
}
```

### Function-like Macro

```rust
// src/function_like.rs
use proc_macro::TokenStream;
use quote::quote;
use syn::parse_macro_input;

#[proc_macro]
pub fn make_struct(input: TokenStream) -> TokenStream {
    // Parse custom syntax
    // make_struct! { name: Type, ... }
    // Generate struct definition
    TokenStream::new()
}
```

## Common Patterns

### 1. Variadic Functions

```rust
macro_rules! println {
    () => { print!("\n") };
    ($fmt:expr) => { print!(concat!($fmt, "\n")) };
    ($fmt:expr, $($arg:tt)*) => { print!(concat!($fmt, "\n"), $($arg)*) };
}
```

### 2. DSL Creation

```rust
macro_rules! html {
    ($tag:ident { $($content:tt)* }) => {
        format!("<{}>{}</{}>", stringify!($tag), html_inner!($($content)*), stringify!($tag))
    };
}

macro_rules! html_inner {
    () => { String::new() };
    ($text:expr) => { $text.to_string() };
    ($tag:ident { $($content:tt)* } $($rest:tt)*) => {
        format!("{}{}", html!($tag { $($content)* }), html_inner!($($rest)*))
    };
}

fn main() {
    let page = html! {
        div {
            h1 { "Hello" }
            p { "World" }
        }
    };
}
```

### 3. Compile-Time Computation

```rust
macro_rules! const_pow {
    ($base:expr, 0) => { 1 };
    ($base:expr, $exp:expr) => {
        $base * const_pow!($base, $exp - 1)
    };
}

const RESULT: i32 = const_pow!(2, 10); // 1024 at compile time
```

## Testing Macros

```rust
#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_vec_macro() {
        let v = vec![1, 2, 3];
        assert_eq!(v, vec![1, 2, 3]);
    }
    
    #[test]
    fn test_macro_expansion() {
        // Use `cargo expand` to see expanded code
    }
}
```

## Debugging Macros

```bash
# Show macro expansion
cargo expand

# Or for specific file
cargo expand --lib 2>&1 | less

# Nightly: rustc -Z macro-backtrace
```

## Best Practices

1. **Prefer functions** over macros when possible
2. **Use `macro_rules!`** for simple code generation
3. **Procedural macros** for complex derive/attribute logic
4. **Export macros** with `#[macro_export]`
5. **Document** with `///` on macro definition
6. **Test** both positive and negative cases
7. **Keep hygiene** in mind — use `$crate` for internal items

## Checkpoint

```rust
// Custom assert with context
macro_rules! assert_eq_context {
    ($left:expr, $right:expr, $context:expr) => {
        if !($left == $right) {
            panic!(
                "assertion failed: `{} == {}` ({})\n  left: `{:?}`\n right: `{:?}`",
                stringify!($left), stringify!($right), $context, $left, $right
            );
        }
    };
}

fn test() {
    let x = 5;
    let y = 10;
    assert_eq_context!(x, y, "x should equal y in test");
}
```

## Next

Continue to [13 Unsafe Rust](./13-unsafe-rust).