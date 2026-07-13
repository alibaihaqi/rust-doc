---
title: 06 Traits and Generics
tier: rust-language
platform: rust
---

# 06 Traits and Generics

## Goal

Define shared behavior with traits, use generics for type abstraction, and understand trait bounds.

## Traits

```rust
pub trait Summary {
    fn summarize(&self) -> String {
        String::from("(Read more...)")
    }
}

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

// Where clause (cleaner for complex bounds)
fn notify<T, U>(t: &T, u: &U) -> String
where
    T: Summary + Display,
    U: Clone + Debug,
{
    format!("{}", t.summarize())
}
```

## Implementing Traits for Types

```rust
impl Summary for String {
    fn summarize(&self) -> String {
        format!("String: {}", self)
    }
}
```

### Orphan Rule

You can implement a trait for a type only if **either** the trait **or** the type is local to your crate.

```rust
// OK - local trait for external type
impl Summary for Vec<String> { ... }

// OK - external trait for local type
impl Display for MyType { ... }

// NOT OK - external trait for external type
impl Display for Vec<String> { ... } // ERROR
```

## Generics

### Generic Functions

```rust
fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0];
    for item in list {
        if item > largest {
            largest = item;
        }
    }
    largest
}
```

### Generic Structs

```rust
struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    fn x(&self) -> &T {
        &self.x
    }
}

impl Point<f32> {
    fn distance_from_origin(&self) -> f32 {
        (self.x.powi(2) + self.y.powi(2)).sqrt()
    }
}
```

### Generic Enums

```rust
enum Option<T> {
    None,
    Some(T),
}

enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

## Trait Objects — Dynamic Dispatch

```rust
// Box<dyn Trait> - trait object
fn notify(item: &dyn Summary) {
    println!("Breaking news! {}", item.summarize());
}

fn main() {
    let article = NewsArticle { ... };
    let tweet = Tweet { ... };
    
    notify(&article); // Works!
    notify(&tweet);   // Works!
    
    // Heterogeneous collection
    let items: Vec<Box<dyn Summary>> = vec![
        Box::new(article),
        Box::new(tweet),
    ];
}
```

### Object Safety

Traits are **object safe** if:
- Methods don't return `Self`
- No generic type parameters on methods
- Method doesn't require `Self: Sized`

```rust
// NOT object safe
trait Clone {
    fn clone(&self) -> Self; // Returns Self
}

// Object safe
trait Display {
    fn fmt(&self, f: &mut Formatter) -> Result;
}
```

## Associated Types

```rust
trait Iterator {
    type Item; // Associated type
    fn next(&mut self) -> Option<Self::Item>;
}

struct Counter {
    count: u32,
}

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

### Associated Types vs Generics

```rust
// With generics - multiple impls per type
trait Add<Rhs = Self> {
    type Output;
    fn add(self, rhs: Rhs) -> Self::Output;
}

// With associated types - one impl per type
trait Add {
    type Output;
    fn add(self, rhs: Self) -> Self::Output;
}
```

## Default Implementations

```rust
trait Summary {
    fn summarize_author(&self) -> String;
    
    fn summarize(&self) -> String {
        format!("(Read more from {}...)", self.summarize_author())
    }
}

impl Summary for Tweet {
    fn summarize_author(&self) -> String {
        format!("@{}", self.username)
    }
    // summarize() uses default
}
```

## Trait Bounds with `impl Trait`

```rust
// Argument position - universal
fn notify(item: &impl Summary) { ... }

// Return position - existential
fn returns_summarizable() -> impl Summary {
    Tweet { ... }
}

// Can't return different types:
// fn returns_summarizable(switch: bool) -> impl Summary {
//     if switch { NewsArticle } else { Tweet } // ERROR
// }
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
```

## Newtype Pattern

```rust
struct Wrapper(Vec<String>);

impl Display for Wrapper {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        write!(f, "[{}]", self.0.join(", "))
    }
}
```

## Checkpoint

```rust
use std::fmt::Display;

trait Comparable {
    fn compare(&self, other: &Self) -> std::cmp::Ordering;
}

struct Number(i32);

impl Comparable for Number {
    fn compare(&self, other: &Self) -> std::cmp::Ordering {
        self.0.cmp(&other.0)
    }
}

// Generic function with trait bound
fn max<T: Comparable>(a: T, b: T) -> T {
    match a.compare(&b) {
        std::cmp::Ordering::Greater => a,
        _ => b,
    }
}

// Trait object
fn print_comparable(item: &dyn Comparable + Display) {
    println!("Comparable: {}", item);
}

fn main() {
    let a = Number(5);
    let b = Number(10);
    println!("Max: {}", max(a, b).0); // Max: 10
    
    let items: Vec<Box<dyn Comparable + Display>> = vec![
        Box::new(Number(1)),
        Box::new(Number(2)),
    ];
}
```

## Next

Continue to [07 Error Handling](./07-error-handling).