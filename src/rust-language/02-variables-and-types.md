---
title: 02 Variables and Types
tier: rust-language
platform: rust
---

# 02 Variables and Types

## Goal

Understand Rust's type system, variable bindings, type inference, and basic types.

## Variables

```rust
let x = 5;           // immutable by default
let mut y = 10;      // mutable with mut

// Shadowing - creates new binding
let z = 5;
let z = z + 1;       // z = 6
let z = "hello";     // z = "hello" (type changed!)
```

## Constants

```rust
const MAX_POINTS: u32 = 100_000;
const PI: f64 = 3.14159265359;

// Must have type annotation
// Always immutable
// Can be declared in any scope
// Must be constant expression (not runtime)
```

## Scalar Types

### Integers

| Length | Signed | Unsigned |
|--------|--------|----------|
| 8-bit  | i8     | u8       |
| 16-bit | i16    | u16      |
| 32-bit | i32    | u32      |
| 64-bit | i64    | u64      |
| 128-bit| i128   | u128     |
| arch   | isize  | usize    |

```rust
let decimal = 98_222;
let hex = 0xff;
let octal = 0o77;
let binary = 0b1111_0000;
let byte = b'A'; // u8 only
```

### Floating Point

```rust
let x = 2.0;        // f64 (default)
let y: f32 = 3.0;   // f32
```

### Boolean

```rust
let t = true;
let f: bool = false;
```

### Character

```rust
let c = 'z';
let emoji = '😀';
let chinese = '中';

// char is 4 bytes (Unicode scalar value)
```

## Compound Types

### Tuple

```rust
let tup: (i32, f64, u8) = (500, 6.4, 1);
let (x, y, z) = tup; // destructuring
let five_hundred = tup.0; // index access
```

### Array

```rust
let arr = [1, 2, 3, 4, 5];
let arr: [i32; 5] = [1, 2, 3, 4, 5];
let arr = [3; 5]; // [3, 3, 3, 3, 3]

let first = arr[0];
let second = arr[1];

// Bounds checking at runtime (panic if out of bounds)
```

## Type Inference

```rust
let x = 42;        // i32 (default)
let y = 3.14;      // f64 (default)
let z = "hello";   // &str

// Explicit annotation
let x: u32 = 42;
let y = 42u32;     // suffix syntax
```

## Type Casting

```rust
let x: i32 = 42;
let y = x as u64;     // widening
let z = 255u8 as u16; // widening
let w = 300u16 as u8; // truncating (44)
```

## Checkpoint

```rust
fn main() {
    // Variables
    let mut x = 5;
    println!("x = {}", x);
    x = 6;
    println!("x = {}", x);
    
    // Constants
    const MAX: u32 = 100;
    println!("MAX = {}", MAX);
    
    // Types
    let a: i8 = -10;
    let b: u16 = 1000;
    let c = 3.14f32;
    let d = true;
    let e = 'A';
    
    // Tuple
    let tup = (1, 2.0, "three");
    let (one, two, three) = tup;
    
    // Array
    let arr = [1, 2, 3, 4, 5];
    println!("First: {}", arr[0]);
    
    // Shadowing
    let spaces = "   ";
    let spaces = spaces.len();
    println!("Spaces: {}", spaces);
}
```

Output:
```
x = 5
x = 6
MAX = 100
Spaces: 3
```

## Next

Continue to [03 Ownership and Borrowing](./03-ownership-and-borrowing).