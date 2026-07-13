---
title: 03 Generic Types
tier: intermediate
platform: rust
---

# 03 Generic Types

## Goal

Write flexible, reusable code with generics, trait bounds, and where clauses.

## Generic Functions

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

fn main() {
    let numbers = vec![34, 50, 25, 100, 65];
    println!("Largest: {}", largest(&numbers));
    
    let chars = vec!['y', 'm', 'a', 'q'];
    println!("Largest: {}", largest(&chars));
}
```

## Generic Structs

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

fn main() {
    let integer = Point { x: 5, y: 10 };
    let float = Point { x: 1.0, y: 4.0 };
    // let mixed = Point { x: 5, y: 4.0 }; // ERROR: T must be same type
}
```

### Multiple Generic Types

```rust
struct Point<T, U> {
    x: T,
    y: U,
}

impl<T, U> Point<T, U> {
    fn mixup<V, W>(self, other: Point<V, W>) -> Point<T, W> {
        Point {
            x: self.x,
            y: other.y,
        }
    }
}

fn main() {
    let p1 = Point { x: 5, y: 10.4 };
    let p2 = Point { x: "Hello", y: 'c' };
    let p3 = p1.mixup(p2);
    println!("p3.x = {}, p3.y = {}", p3.x, p3.y); // 5, c
}
```

## Generic Enums

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

## Generic Methods

```rust
struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    fn new(x: T, y: T) -> Self {
        Point { x, y }
    }
}

// Methods only for f32
impl Point<f32> {
    fn distance_from_origin(&self) -> f32 {
        (self.x.powi(2) + self.y.powi(2)).sqrt()
    }
}

fn main() {
    let p = Point::new(3.0, 4.0);
    println!("Distance: {}", p.distance_from_origin());
}
```

## Trait Bounds

```rust
use std::fmt::Display;

fn print_largest<T: Display + PartialOrd>(list: &[T]) {
    let mut largest = &list[0];
    for item in list {
        if item > largest {
            largest = item;
        }
    }
    println!("Largest: {}", largest);
}
```

### `impl Trait` Syntax

```rust
// Argument position - universal
fn notify(item: &impl Summary) { ... }

// Return position - existential
fn returns_summarizable() -> impl Summary { ... }

// Equivalent to:
fn notify<T: Summary>(item: &T) { ... }
fn returns_summarizable() -> Box<dyn Summary> { ... }
```

## Where Clauses

```rust
fn some_function<T, U>(t: &T, u: &U) -> i32
where
    T: Display + Clone,
    U: Clone + Debug,
{
    // ...
}
```

### Where with Associated Types

```rust
trait Container {
    type Item;
    fn get(&self) -> &Self::Item;
}

fn print_container<C>(c: &C)
where
    C: Container,
    C::Item: Display,
{
    println!("Item: {}", c.get());
}
```

## Default Type Parameters

```rust
trait Add<Rhs = Self> {
    type Output;
    fn add(self, rhs: Rhs) -> Self::Output;
}

impl Add for Point {
    type Output = Point;
    fn add(self, other: Point) -> Point {
        Point { x: self.x + other.x, y: self.y + other.y }
    }
}
```

## Monomorphization

Generics are **zero-cost** — compiled to specific types at compile time:

```rust
fn process<T: Display>(item: T) {
    println!("{}", item);
}

// Compiles to:
fn process_i32(item: i32) { println!("{}", item); }
fn process_string(item: String) { println!("{}", item); }
```

## Checkpoint

```rust
use std::fmt::Debug;

fn print_all<T: Debug>(items: &[T]) {
    for item in items {
        println!("{:?}", item);
    }
}

fn min_max<T: PartialOrd + Copy>(items: &[T]) -> (T, T) {
    let mut min = items[0];
    let mut max = items[0];
    for &item in items {
        if item < min { min = item; }
        if item > max { max = item; }
    }
    (min, max)
}

fn main() {
    let nums = [3, 1, 4, 1, 5, 9];
    print_all(&nums);
    let (min, max) = min_max(&nums);
    println!("Min: {}, Max: {}", min, max);
}
```

Output:
```
3
1
4
1
5
9
Min: 1, Max: 9
```

## Next

Continue to [04 Traits](./04-traits).