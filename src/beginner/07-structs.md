---
title: 07 Structs
tier: beginner
platform: rust
---

# 07 Structs

## Goal

Create custom data types with structs, methods, and associated functions.

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
    
    println!("{} {}", user1.username, user1.email);
}
```

### Field Init Shorthand

```rust
fn build_user(email: String, username: String) -> User {
    User {
        active: true,
        username,
        email,
        sign_in_count: 1,
    }
}
```

### Struct Update Syntax

```rust
let user2 = User {
    email: String::from("bob@example.com"),
    ..user1 // copy remaining fields
};
```

### Tuple Structs

```rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

let black = Color(0, 0, 0);
let origin = Point(0, 0, 0);
```

### Unit-Like Structs

```rust
struct AlwaysEqual;

let subject = AlwaysEqual;
```

## Methods

```rust
impl User {
    fn greet(&self) {
        println!("Hello, {}!", self.username);
    }
    
    fn is_active(&self) -> bool {
        self.active
    }
    
    // mutable method
    fn deactivate(&mut self) {
        self.active = false;
    }
}

fn main() {
    let mut user = build_user(
        String::from("alice@example.com"),
        String::from("alice"),
    );
    user.greet();
    println!("Active: {}", user.is_active());
    user.deactivate();
}
```

## Associated Functions

```rust
impl User {
    fn new(username: String, email: String) -> User {
        User {
            active: true,
            username,
            email,
            sign_in_count: 0,
        }
    }
}

let user = User::new(String::from("bob"), String::from("bob@test.com"));
```

## Checkpoint

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

Output:
```
Area: 1500
Can hold: true
```

## Next

Continue to [08 Enums and Pattern Matching](./08-enums-and-pattern-matching).