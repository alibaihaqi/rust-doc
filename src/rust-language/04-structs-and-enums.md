---
title: 04 Structs and Enums
tier: rust-language
platform: rust
---

# 04 Structs and Enums

## Goal

Define custom data types with structs and enums, and implement behavior with `impl`.

## Structs

### Classic Struct

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

fn main() {
    let user1 = User {
        active: true,
        username: String::from("alice"),
        email: String::from("alice@example.com"),
        sign_in_count: 1,
    };
    
    // Field init shorthand
    let user2 = build_user(String::from("bob@example.com"));
    
    // Struct update syntax
    let user3 = User {
        email: String::from("carol@example.com"),
        ..user1 // copy remaining from user1
    };
}

fn build_user(email: String) -> User {
    User {
        active: true,
        username: email.clone(),
        email,
        sign_in_count: 1,
    }
}
```

### Tuple Structs

```rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

let black = Color(0, 0, 0);
let origin = Point(0, 0, 0);

// Access by index
println!("Red: {}", black.0);
```

### Unit-Like Structs

```rust
struct AlwaysEqual;

let subject = AlwaysEqual;
```

## Methods

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
    
    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
    
    // Associated function (like static method)
    fn square(size: u32) -> Rectangle {
        Rectangle { width: size, height: size }
    }
}

fn main() {
    let rect = Rectangle { width: 30, height: 50 };
    println!("Area: {}", rect.area());
    
    let sq = Rectangle::square(10);
}
```

## Enums

```rust
enum IpAddrKind {
    V4,
    V6,
}

enum IpAddr {
    V4(u8, u8, u8, u8),
    V6(String),
}

fn main() {
    let home = IpAddr::V4(127, 0, 0, 1);
    let loopback = IpAddr::V6(String::from("::1"));
}
```

### Option Enum

```rust
enum Option<T> {
    None,
    Some(T),
}

fn main() {
    let some_number = Some(5);
    let none: Option<i32> = None;
    
    // Pattern matching required to access
    match some_number {
        Some(x) => println!("Got: {}", x),
        None => println!("Nothing"),
    }
}
```

### Result Enum

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}

fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err("Cannot divide by zero".to_string())
    } else {
        Ok(a / b)
    }
}
```

## Pattern Matching

```rust
fn describe(ip: IpAddr) {
    match ip {
        IpAddr::V4(a, b, c, d) => println!("IPv4: {}.{}.{}.{}", a, b, c, d),
        IpAddr::V6(s) => println!("IPv6: {}", s),
    }
}

fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}
```

### `if let` — Concise Matching

```rust
fn main() {
    let config_max = Some(3u8);
    
    if let Some(max) = config_max {
        println!("Max: {}", max);
    }
    
    // With else
    let mut count = 0;
    if let Some(x) = config_max {
        println!("{}", x);
    } else {
        count += 1;
    }
}
```

## Checkpoint

```rust
#[derive(Debug)]
struct Point {
    x: f64,
    y: f64,
}

impl Point {
    fn origin() -> Point {
        Point { x: 0.0, y: 0.0 }
    }
    
    fn distance(&self, other: &Point) -> f64 {
        ((self.x - other.x).powi(2) + (self.y - other.y).powi(2)).sqrt()
    }
}

enum Shape {
    Circle { center: Point, radius: f64 },
    Rectangle { top_left: Point, bottom_right: Point },
}

impl Shape {
    fn area(&self) -> f64 {
        match self {
            Shape::Circle { radius, .. } => std::f64::consts::PI * radius * radius,
            Shape::Rectangle { top_left, bottom_right } => {
                let width = (bottom_right.x - top_left.x).abs();
                let height = (bottom_right.y - top_left.y).abs();
                width * height
            }
        }
    }
}

fn main() {
    let p1 = Point { x: 0.0, y: 0.0 };
    let p2 = Point { x: 3.0, y: 4.0 };
    println!("Distance: {}", p1.distance(&p2)); // 5.0
    
    let circle = Shape::Circle { center: p1, radius: 2.0 };
    println!("Circle area: {:.2}", circle.area());
    
    let rect = Shape::Rectangle {
        top_left: Point { x: 0.0, y: 0.0 },
        bottom_right: Point { x: 5.0, y: 3.0 },
    };
    println!("Rect area: {}", rect.area());
}
```

Output:
```
Distance: 5.0
Circle area: 12.57
Rect area: 15.0
```

## Next

Continue to [05 Pattern Matching](./05-pattern-matching).