---
title: 08 Enums and Pattern Matching
tier: beginner
platform: rust
---

# 08 Enums and Pattern Matching

## Goal

Define enums, use `match` for exhaustive pattern matching, and understand `Option`.

## Defining Enums

```rust
enum IpAddrKind {
    V4,
    V6,
}

fn main() {
    let four = IpAddrKind::V4;
    let six = IpAddrKind::V6;
}
```

### Enum with Data

```rust
enum IpAddr {
    V4(u8, u8, u8, u8),
    V6(String),
}

fn main() {
    let home = IpAddr::V4(127, 0, 0, 1);
    let loopback = IpAddr::V6(String::from("::1"));
}
```

### Standard Library Examples

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}
```

## `match` Control Flow

```rust
fn main() {
    let coin = Coin::Quarter(UsState::Alaska);
    let cents = value_in_cents(coin);
    println!("{}", cents);
}

enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter(UsState),
}

#[derive(Debug)]
enum UsState {
    Alabama,
    Alaska,
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter(state) => {
            println!("State quarter from {:?}!", state);
            25
        }
    }
}
```

## `Option<T>` - Handling Absence

```rust
fn main() {
    let some_number = Some(5);
    let no_number: Option<i32> = None;
    
    // Match on Option
    let result = match some_number {
        Some(x) => x * 2,
        None => 0,
    };
    println!("{}", result); // 10
}
```

### Common Patterns

```rust
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}
```

## `if let` - Concise Matching

```rust
fn main() {
    let config_max = Some(3u8);
    
    if let Some(max) = config_max {
        println!("Max is {}", max);
    }
    
    // With else
    let mut count = 0;
    if let Some(x) = some_option {
        println!("Got {}", x);
    } else {
        count += 1;
    }
}
```

## Checkpoint

```rust
enum Shape {
    Circle(f64),
    Rectangle(f64, f64),
    Triangle(f64, f64, f64),
}

fn area(shape: Shape) -> f64 {
    match shape {
        Shape::Circle(r) => std::f64::consts::PI * r * r,
        Shape::Rectangle(w, h) => w * h,
        Shape::Triangle(a, b, c) => {
            let s = (a + b + c) / 2.0;
            (s * (s - a) * (s - b) * (s - c)).sqrt()
        }
    }
}

fn main() {
    println!("{}", area(Shape::Circle(5.0)));
    println!("{}", area(Shape::Rectangle(3.0, 4.0)));
}
```

## Next

Continue to [09 Collections](./09-collections).