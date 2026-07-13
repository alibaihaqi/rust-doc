---
title: 06 Control Flow
tier: beginner
platform: rust
---

# 06 Control Flow

## Goal

Master `if`, `else`, `else if`, and loops in Rust.

## If Expressions

```rust
fn main() {
    let number = 6;

    if number % 4 == 0 {
        println!("divisible by 4");
    } else if number % 3 == 0 {
        println!("divisible by 3");
    } else if number % 2 == 0 {
        println!("divisible by 2");
    } else {
        println!("not divisible by 4, 3, or 2");
    }
}
```

Key: `if` is an expression, returns a value:

```rust
fn main() {
    let condition = true;
    let number = if condition { 5 } else { 6 };
    println!("{}", number);
}
```

Branches must return same type.

## Loops

### `loop` - Infinite

```rust
fn main() {
    let mut count = 0;
    let result = loop {
        count += 1;
        if count == 10 {
            break count * 2; // return value
        }
    };
    println!("{}", result); // 20
}
```

### `while` - Conditional

```rust
fn main() {
    let mut n = 3;
    while n != 0 {
        println!("{}", n);
        n -= 1;
    }
    println!("LIFTOFF!");
}
```

### `for` - Iterator

```rust
fn main() {
    let arr = [10, 20, 30, 40, 50];
    for element in arr {
        println!("{}", element);
    }
    
    // Range
    for n in (1..4).rev() {
        println!("{}", n);
    }
}
```

## Checkpoint

```rust
fn main() {
    let n = 10;
    
    // FizzBuzz
    for i in 1..=n {
        match (i % 3, i % 5) {
            (0, 0) => println!("FizzBuzz"),
            (0, _) => println!("Fizz"),
            (_, 0) => println!("Buzz"),
            _ => println!("{}", i),
        }
    }
}
```

## Next

Continue to [07 Structs](./07-structs).