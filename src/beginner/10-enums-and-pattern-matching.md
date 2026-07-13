---
title: 10 Enums and Pattern Matching
tier: beginner
platform: rust
---

# 10 Enums and Pattern Matching

## Goal

Define enums with data, use `match` for exhaustive pattern matching, and understand `Option` and `Result`.

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

## The `match` Control Flow

```rust
fn main() {
    let coin = Coin::Quarter(UsState::Alaska);
    let cents = value_in_cents(coin);
    println!("{} cents", cents);
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

### Matching with `Option<T>`

```rust
fn main() {
    let five = Some(5);
    let six = plus_one(five);
    let none = plus_one(None);
    
    println!("{:?}, {:?}", six, none); // Some(6), None
}

fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}
```

### Matches Are Exhaustive

```rust
fn describe(x: Option<i32>) {
    match x {
        Some(n) => println!("Some({})", n),
        None => println!("None"),
    }
}
```

## `if let` Concise Control Flow

```rust
fn main() {
    let config_max = Some(3u8);
    
    if let Some(max) = config_max {
        println!("Max is {}", max);
    }
    
    // With else
    let mut count = 0;
    if let Some(x) = config_max {
        println!("Got {}", x);
    } else {
        count += 1;
    }
}
```

### `while let`

```rust
fn main() {
    let mut stack = Vec::new();
    stack.push(1);
    stack.push(2);
    stack.push(3);
    
    while let Some(top) = stack.pop() {
        println!("{}", top);
    }
}
```

## `Option<T>` — Handling Absence

```rust
fn main() {
    let some_number = Some(5);
    let no_number: Option<i32> = None;
    
    // Get value or default
    let x = some_number.unwrap_or(0);
    let y = no_number.unwrap_or(0);
    
    // Get value or panic with message
    let z = some_number.expect("Should have a number");
}
```

### Common `Option` Methods

| Method | Description |
|--------|-------------|
| `is_some()` | Returns `true` if `Some` |
| `is_none()` | Returns `true` if `None` |
| `unwrap()` | Returns value or panics |
| `unwrap_or(default)` | Returns value or default |
| `expect(msg)` | Returns value or panics with msg |
| `map(f)` | Transforms `Some` value |
| `and_then(f)` | Chains `Option` returning functions |

## `Result<T, E>` — Recoverable Errors

```rust
use std::fs::File;

fn main() {
    let f = File::open("hello.txt");
    
    let f = match f {
        Ok(file) => file,
        Err(error) => {
            panic!("Problem opening file: {:?}", error);
        }
    };
}
```

### Matching on Different Errors

```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let f = File::open("hello.txt");
    
    let f = match f {
        Ok(file) => file,
        Err(error) => match error.kind() {
            ErrorKind::NotFound => match File::create("hello.txt") {
                Ok(fc) => fc,
                Err(e) => panic!("Problem creating file: {:?}", e),
            },
            other_error => panic!("Problem opening file: {:?}", other_error),
        },
    };
}
```

### The `?` Operator

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username() -> Result<String, io::Error> {
    let mut f = File::open("hello.txt")?;
    let mut s = String::new();
    f.read_to_string(&mut s)?;
    Ok(s)
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
    println!("Circle: {:.2}", area(Shape::Circle(5.0)));
    println!("Rectangle: {:.2}", area(Shape::Rectangle(3.0, 4.0)));
    println!("Triangle: {:.2}", area(Shape::Triangle(3.0, 4.0, 5.0)));
}
```

Output:
```
Circle: 78.54
Rectangle: 12.00
Triangle: 6.00
```

## Next

Continue to [11 Collections](./11-collections).