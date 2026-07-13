---
title: 04 Data Types
tier: beginner
platform: rust
---

# 04 Data Types

## Goal

Understand Rust's scalar and compound types.

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

Default: `i32`

```rust
fn main() {
    let a: i32 = 42;
    let b = 3.14; // f64 default
    let c = true; // bool
    let d = 'z';  // char (4 bytes, Unicode)
}
```

### Floating Point

- `f32` - 32-bit
- `f64` - 64-bit (default)

```rust
fn main() {
    let x = 2.0; // f64
    let y: f32 = 3.0;
}
```

### Boolean

```rust
fn main() {
    let t = true;
    let f: bool = false;
}
```

### Character

```rust
fn main() {
    let c = 'z';
    let emoji = '😀';
    let chinese = '中';
}
```

## Compound Types

### Tuple

Fixed size, heterogeneous:

```rust
fn main() {
    let tup: (i32, f64, u8) = (500, 6.4, 1);
    let (x, y, z) = tup; // destructuring
    println!("{} {} {}", x, y, z);
    
    let five_hundred = tup.0; // index access
}
```

### Array

Fixed size, homogeneous:

```rust
fn main() {
    let arr = [1, 2, 3, 4, 5];
    let first = arr[0];
    let second = arr[1];
    
    // Type annotation: [type; size]
    let months: [&str; 12] = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
}
```

## Checkpoint

```rust
fn main() {
    let integer: i64 = 42;
    let float = 3.14159;
    let boolean = true;
    let character = 'R';
    let tuple = (1, 2.0, 'a');
    let array = [1, 2, 3];
    
    println!("{:?}", (integer, float, boolean, character, tuple, array));
}
```

## Next

Continue to [05 Functions](./05-functions).