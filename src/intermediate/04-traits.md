---
title: 04 Traits
tier: intermediate
platform: rust
---

# 04 Traits

## Goal

Define shared behavior with traits, implement them for types, and use trait objects for dynamic dispatch.

## Defining Traits

```rust
pub trait Summary {
    fn summarize(&self) -> String;
    
    // Default implementation
    fn summarize_author(&self) -> String {
        String::from("(Unknown author)")
    }
}
```

## Implementing Traits

```rust
struct NewsArticle {
    headline: String,
    location: String,
    author: String,
    content: String,
}

impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{}, by {} ({})", self.headline, self.author, self.location)
    }
}

struct Tweet {
    username: String,
    content: String,
    reply: bool,
    retweet: bool,
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("{}: {}", self.username, self.content)
    }
}
```

## Trait Bounds

```rust
// Generic with trait bound
fn notify<T: Summary>(item: &T) {
    println!("Breaking news! {}", item.summarize());
}

// Multiple bounds
fn notify<T: Summary + Display>(item: &T) { ... }

// impl Trait syntax (argument position)
fn notify(item: &impl Summary) { ... }

// Where clause
fn notify<T>(item: &T) where T: Summary + Display { ... }
```

## Returning Types that Implement Traits

```rust
fn returns_summarizable() -> impl Summary {
    Tweet {
        username: String::from("horse_ebooks"),
        content: String::from("of course, as you probably already know, people"),
        reply: false,
        retweet: false,
    }
}

// Can only return ONE concrete type
fn returns_summarizable(switch: bool) -> impl Summary {
    if switch {
        NewsArticle { ... }
    } else {
        Tweet { ... } // ERROR: if/else branches must return same type
    }
}
```

## Trait Objects — Dynamic Dispatch

```rust
fn notify(item: &dyn Summary) {
    println!("Breaking news! {}", item.summarize());
}

fn main() {
    let article = NewsArticle { ... };
    let tweet = Tweet { ... };
    
    let items: Vec<&dyn Summary> = vec![&article, &tweet];
    for item in items {
        notify(item);
    }
}
```

### Object Safety

Traits are **object safe** if:
- All methods return `Self` or don't have generic type parameters
- No `Self: Sized` bound

```rust
// Object safe
trait Draw {
    fn draw(&self);
}

// NOT object safe
trait Clone {
    fn clone(&self) -> Self; // returns Self
}

trait Generic {
    fn method<T>(&self, t: T); // generic method
}
```

## Supertraits

```rust
trait OutlinePrint: Display {
    fn outline_print(&self) {
        let output = self.to_string();
        let len = output.len();
        println!("{}", "*".repeat(len + 4));
        println!("* {} *", output);
        println!("{}", "*".repeat(len + 4));
    }
}

impl OutlinePrint for Point {}
```

## The Newtype Pattern

```rust
// Can't implement external trait for external type (orphan rule)
struct Wrapper(Vec<String>);

impl Display for Wrapper {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "[{}]", self.0.join(", "))
    }
}

// Deref to delegate to inner type
use std::ops::Deref;

impl Deref for Wrapper {
    type Target = Vec<String>;
    fn deref(&self) -> &Self::Target {
        &self.0
    }
}
```

## Associated Types

```rust
trait Iterator {
    type Item;
    fn next(&mut self) -> Option<Self::Item>;
}

struct Counter { count: u32 }

impl Iterator for Counter {
    type Item = u32;
    fn next(&mut self) -> Option<u32> {
        if self.count < 5 {
            self.count += 1;
            Some(self.count)
        } else {
            None
        }
    }
}
```

## Operator Overloading

```rust
use std::ops::Add;

#[derive(Debug, PartialEq)]
struct Point { x: i32, y: i32 }

impl Add for Point {
    type Output = Point;
    fn add(self, other: Point) -> Point {
        Point { x: self.x + other.x, y: self.y + other.y }
    }
}

fn main() {
    let p1 = Point { x: 1, y: 0 };
    let p2 = Point { x: 2, y: 3 };
    println!("{:?}", p1 + p2); // Point { x: 3, y: 3 }
}
```

## Checkpoint

```rust
use std::fmt::Display;

trait Speaker {
    fn speak(&self) -> String;
}

struct Dog { name: String }
struct Cat { name: String }

impl Speaker for Dog {
    fn speak(&self) -> String { format!("{} says woof!", self.name) }
}

impl Speaker for Cat {
    fn speak(&self) -> String { format!("{} says meow!", self.name) }
}

fn make_speak(animal: &dyn Speaker) {
    println!("{}", animal.speak());
}

fn main() {
    let animals: Vec<&dyn Speaker> = vec![&Dog { name: "Rex".into() }, &Cat { name: "Whiskers".into() }];
    for a in animals { make_speak(a); }
}
```

Output:
```
Rex says woof!
Whiskers says meow!
```

## Next

Continue to [05 Lifetimes](./05-lifetimes).