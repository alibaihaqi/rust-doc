---
title: 05 Functions
tier: beginner
platform: rust
---

# 05 Functions

## Goal

Learn function syntax, parameters, return values, and expressions vs statements.

## Steps

### Basic Function

```rust
fn main() {
    another_function();
}

fn another_function() {
    println!("Another function");
}
```

### Parameters

```rust
fn main() {
    print_labeled_measurement(5, 'h');
}

fn print_labeled_measurement(value: i32, unit: char) {
    println!("Measurement: {}{}", value, unit);
}
```

### Return Values

```rust
fn five() -> i32 {
    5 // expression, no semicolon
}

fn main() {
    let x = five();
    println!("x = {}", x);
}
```

### Expressions vs Statements

- **Statements**: end with `;`, no return value
- **Expressions**: evaluate to a value, no trailing `;`

```rust
fn main() {
    let y = {
        let x = 3;
        x + 1 // expression - returns 4
    };
    println!("y = {}", y);
}
```

### Early Return

```rust
fn main() {
    let result = if 3 > 2 { 10 } else { 20 };
    println!("{}", result); // 10
}
```

## Checkpoint

```rust
fn celsius_to_fahrenheit(c: f64) -> f64 {
    c * 9.0 / 5.0 + 32.0
}

fn main() {
    let c = 25.0;
    let f = celsius_to_fahrenheit(c);
    println!("{}°C = {}°F", c, f);
}
```

Output: `25°C = 77°F`

## Next

Continue to [06 Control Flow](./06-control-flow).