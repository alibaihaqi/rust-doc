---
title: 10 Error Handling
tier: beginner
platform: rust
---

# 10 Error Handling

## Goal

Handle errors idiomatically with `Result<T, E>` and `Option<T>`.

## Unrecoverable Errors - `panic!`

```rust
fn main() {
    // panic!("crash");
    // let v = vec![1, 2, 3];
    // v[99]; // panic: index out of bounds
}
```

Use for: bugs, impossible states.

## Recoverable Errors - `Result<T, E>`

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
    let f = File::open("hello.txt").unwrap_or_else(|error| {
        if error.kind() == ErrorKind::NotFound {
            File::create("hello.txt").unwrap_or_else(|e| {
                panic!("Problem creating file: {:?}", e);
            })
        } else {
            panic!("Problem opening file: {:?}", error);
        }
    });
}
```

## Shortcuts

```rust
// unwrap - panic on Err
let f = File::open("hello.txt").unwrap();

// expect - panic with message
let f = File::open("hello.txt").expect("Failed to open hello.txt");
```

## Propagating Errors - `?` Operator

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

### Chaining

```rust
fn read_username() -> Result<String, io::Error> {
    let mut s = String::new();
    File::open("hello.txt")?.read_to_string(&mut s)?;
    Ok(s)
}
```

## `Option<T>` - Optional Values

```rust
fn main() {
    let some_number = Some(5);
    let none: Option<i32> = None;
    
    match some_number {
        Some(x) => println!("Got {}", x),
        None => println!("Nothing"),
    }
    
    // Shortcuts
    let x = some_number.unwrap_or(0);
    let x = some_number.expect("Should have value");
}
```

## Checkpoint

```rust
use std::fs;
use std::io;

fn read_config() -> Result<String, io::Error> {
    fs::read_to_string("config.toml")
}

fn parse_config(contents: &str) -> Result<Config, ParseError> {
    // parse logic
    Ok(Config { port: 8080 })
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let contents = read_config()?;
    let config = parse_config(&contents)?;
    println!("Port: {}", config.port);
    Ok(())
}

struct Config { port: u16 }
#[derive(Debug)] struct ParseError;
```

## Next

Continue to [Intermediate](/intermediate/) tier.