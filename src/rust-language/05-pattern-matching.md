---
title: 05 Pattern Matching
tier: rust-language
platform: rust
---

# 05 Pattern Matching

## Goal

Master `match`, `if let`, `while let`, destructuring, guards, and exhaustiveness.

## `match` Expressions

```rust
fn main() {
    let number = 13;
    
    match number {
        1 => println!("One"),
        2 => println!("Two"),
        3 | 4 | 5 => println!("Three to five"),
        6..=10 => println!("Six to ten"),
        _ => println!("Something else"),
    }
}
```

### Matching on Enums

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

fn process(msg: Message) {
    match msg {
        Message::Quit => println!("Quit"),
        Message::Move { x, y } => println!("Move to ({}, {})", x, y),
        Message::Write(text) => println!("Write: {}", text),
        Message::ChangeColor(r, g, b) => println!("Color: {} {} {}", r, g, b),
    }
}
```

### Destructuring Structs

```rust
struct Point { x: i32, y: i32 }

fn main() {
    let p = Point { x: 0, y: 7 };
    
    match p {
        Point { x, y: 0 } => println!("On x axis: {}", x),
        Point { x: 0, y } => println!("On y axis: {}", y),
        Point { x, y } => println!("({}, {})", x, y),
    }
}
```

### Destructuring Tuples

```rust
fn main() {
    let tuple = (1, 2.0, "three");
    
    match tuple {
        (x, y, z) => println!("{} {} {}", x, y, z),
        (0, _, _) => println!("First is zero"),
    }
}
```

## Match Guards

```rust
fn main() {
    let num = Some(4);
    
    match num {
        Some(x) if x < 5 => println!("Less than five: {}", x),
        Some(x) => println!("Five or more: {}", x),
        None => println!("None"),
    }
}

fn main() {
    let x = Some(5);
    let y = 10;
    
    match x {
        Some(50) => println!("Got 50"),
        Some(n) if n == y => println!("Matched, n = {}", n),
        _ => println!("Default"),
    }
}
```

## `@` Bindings

```rust
enum Message {
    Hello { id: i32 },
}

fn main() {
    let msg = Message::Hello { id: 5 };
    
    match msg {
        Message::Hello { id: id_variable @ 3..=7 } => {
            println!("Found id in range: {}", id_variable);
        }
        Message::Hello { id: 10..=12 } => {
            println!("Found id in another range");
        }
        Message::Hello { id } => {
            println!("Found some other id: {}", id);
        }
    }
}
```

## `if let` and `while let`

### `if let`

```rust
fn main() {
    let config_max = Some(3u8);
    
    if let Some(max) = config_max {
        println!("The maximum is {}", max);
    }
    
    // With else
    let mut count = 0;
    if let Some(max) = config_max {
        println!("The maximum is {}", max);
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

## Exhaustiveness

```rust
enum Color { Red, Green, Blue }

fn print_color(c: Color) {
    match c {
        Color::Red => println!("Red"),
        Color::Green => println!("Green"),
        Color::Blue => println!("Blue"),
        // _ => println!("Other"), // Unreachable! Compiler knows
    }
}
```

### Non-Exhaustive Enums (Library Authors)

```rust
#[non_exhaustive]
pub enum Error {
    Io(std::io::Error),
    Parse(std::num::ParseIntError),
}

// Users MUST use _ arm
fn handle(e: Error) {
    match e {
        Error::Io(_) => {}
        Error::Parse(_) => {}
        _ => {} // Required because enum may grow
    }
}
```

## Patterns in `let`

```rust
fn main() {
    let (x, y, z) = (1, 2, 3);
    println!("{} {} {}", x, y, z);
    
    let Point { x, y } = Point { x: 10, y: 20 };
    
    let [first, second, ..] = [1, 2, 3, 4, 5];
}
```

## Function Parameters

```rust
fn print_coords(&(x, y): &(i32, i32)) {
    println!("({}, {})", x, y);
}

fn main() {
    let point = (3, 5);
    print_coords(&point);
}
```

## Range Patterns

```rust
fn main() {
    let x = 5;
    
    match x {
        1..=5 => println!("One through five"),
        6..=10 => println!("Six through ten"),
        _ => println!("Other"),
    }
    
    // Char ranges
    let c = 'c';
    match c {
        'a'..='j' => println!("Early letter"),
        'k'..='z' => println!("Late letter"),
        _ => println!("Other"),
    }
}
```

## Checkpoint

```rust
#[derive(Debug)]
enum Event {
    Click { x: i32, y: i32 },
    KeyPress(char),
    Resize { width: u32, height: u32 },
    Quit,
}

fn handle_event(event: Event) {
    match event {
        Event::Click { x, y } if x > 0 && y > 0 => {
            println!("Click in positive quadrant: ({}, {})", x, y);
        }
        Event::Click { x, y } => {
            println!("Click at ({}, {})", x, y);
        }
        Event::KeyPress(c) => println!("Key: {}", c),
        Event::Resize { width, height } => {
            println!("Resize to {}x{}", width, height);
        }
        Event::Quit => println!("Quitting"),
    }
}

fn main() {
    let events = vec![
        Event::Click { x: 10, y: 20 },
        Event::KeyPress('q'),
        Event::Resize { width: 800, height: 600 },
        Event::Quit,
    ];
    
    for event in events {
        handle_event(event);
    }
}
```

Output:
```
Click in positive quadrant: (10, 20)
Key: q
Resize to 800x600
Quitting
```

## Next

Continue to [06 Traits and Generics](./06-traits-and-generics).