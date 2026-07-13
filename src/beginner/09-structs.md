---
title: 09 Structs
tier: beginner
platform: rust
---

# 09 Structs

## Goal

Create custom data types with structs, add methods with `impl`, and understand associated functions.

## Defining Structs

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
    
    println!("User: {}", user1.username);
    println!("Email: {}", user1.email);
}
```

### Accessing Fields

```rust
fn main() {
    let mut user = User {
        active: true,
        username: String::from("alice"),
        email: String::from("alice@example.com"),
        sign_in_count: 1,
    };
    
    user.email = String::from("alice@newdomain.com");
    println!("New email: {}", user.email);
}
```

### Field Init Shorthand

```rust
fn build_user(email: String, username: String) -> User {
    User {
        active: true,
        username,    // shorthand for username: username
        email,       // shorthand for email: email
        sign_in_count: 1,
    }
}

fn main() {
    let user = build_user(
        String::from("bob@example.com"),
        String::from("bob"),
    );
}
```

### Struct Update Syntax

```rust
fn main() {
    let user1 = build_user(
        String::from("alice@example.com"),
        String::from("alice"),
    );
    
    let user2 = User {
        email: String::from("bob@example.com"),
        ..user1 // copy remaining fields from user1
    };
    
    println!("{} {}", user2.username, user2.email); // alice bob@example.com
}
```

### Tuple Structs

```rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

fn main() {
    let black = Color(0, 0, 0);
    let origin = Point(0, 0, 0);
    
    println!("Color: ({}, {}, {})", black.0, black.1, black.2);
}
```

### Unit-Like Structs

```rust
struct AlwaysEqual;

fn main() {
    let subject = AlwaysEqual;
}
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
}

fn main() {
    let rect1 = Rectangle { width: 30, height: 50 };
    let rect2 = Rectangle { width: 10, height: 40 };
    
    println!("Area: {}", rect1.area());
    println!("Can hold: {}", rect1.can_hold(&rect2));
}
```

### Mutable Methods

```rust
impl Rectangle {
    fn set_width(&mut self, width: u32) {
        self.width = width;
    }
}

fn main() {
    let mut rect = Rectangle { width: 30, height: 50 };
    rect.set_width(40);
    println!("New area: {}", rect.area());
}
```

## Associated Functions

```rust
impl Rectangle {
    fn square(size: u32) -> Rectangle {
        Rectangle {
            width: size,
            height: size,
        }
    }
}

fn main() {
    let sq = Rectangle::square(30);
    println!("Square area: {}", sq.area());
}
```

## Checkpoint

```rust
struct Circle {
    radius: f64,
}

impl Circle {
    fn new(radius: f64) -> Circle {
        Circle { radius }
    }
    
    fn area(&self) -> f64 {
        std::f64::consts::PI * self.radius * self.radius
    }
    
    fn circumference(&self) -> f64 {
        2.0 * std::f64::consts::PI * self.radius
    }
}

fn main() {
    let c = Circle::new(5.0);
    println!("Area: {:.2}", c.area());
    println!("Circumference: {:.2}", c.circumference());
}
```

Output:
```
Area: 78.54
Circumference: 31.42
```

## Next

Continue to [10 Enums and Pattern Matching](./10-enums-and-pattern-matching).