---
title: 07 Error Handling
tier: rust-language
platform: rust
---

# 07 Error Handling

## Goal

Handle errors with `Result<T, E>`, `Option<T>`, custom error types, and the `?` operator.

## `Result<T, E>`

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}

fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err("Division by zero".to_string())
    } else {
        Ok(a / b)
    }
}

fn main() {
    match divide(10.0, 2.0) {
        Ok(result) => println!("Result: {}", result),
        Err(e) => println!("Error: {}", e),
    }
}
```

## `Option<T>`

```rust
enum Option<T> {
    None,
    Some(T),
}

fn find_user(id: u32) -> Option<String> {
    if id == 1 { Some("Alice".to_string()) }
    else { None }
}

fn main() {
    match find_user(1) {
        Some(name) => println!("Found: {}", name),
        None => println!("Not found"),
    }
}
```

## The `?` Operator

```rust
use std::fs::File;
use std::io::Read;

fn read_file(path: &str) -> Result<String, std::io::Error> {
    let mut file = File::open(path)?; // Returns Err if error
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}

// In main (which returns Result)
fn main() -> Result<(), std::io::Error> {
    let contents = read_file("hello.txt")?;
    println!("{}", contents);
    Ok(())
}
```

### `?` with Different Error Types

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username() -> Result<String, io::Error> {
    let mut file = File::open("user.txt")?;
    let mut username = String::new();
    file.read_to_string(&mut username)?;
    Ok(username)
}
```

## Combining `Result` and `Option`

```rust
fn main() {
    let x = Some(5);
    let y = Some(10);
    
    // and_then for Option
    let result = x.and_then(|a| y.map(|b| a + b));
    println!("{:?}", result); // Some(15)
    
    // and_then for Result
    let result = Ok(5).and_then(|a| Ok(a * 2));
    println!("{:?}", result); // Ok(10)
}
```

## Custom Error Types

```rust
use std::fmt;
use std::error::Error;

#[derive(Debug)]
enum AppError {
    Io(std::io::Error),
    Parse(std::num::ParseIntError),
    Custom(String),
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            AppError::Io(e) => write!(f, "IO error: {}", e),
            AppError::Parse(e) => write!(f, "Parse error: {}", e),
            AppError::Custom(s) => write!(f, "Error: {}", s),
        }
    }
}

impl Error for AppError {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        match self {
            AppError::Io(e) => Some(e),
            AppError::Parse(e) => Some(e),
            AppError::Custom(_) => None,
        }
    }
}

impl From<std::io::Error> for AppError {
    fn from(e: std::io::Error) -> Self {
        AppError::Io(e)
    }
}

impl From<std::num::ParseIntError> for AppError {
    fn from(e: std::num::ParseIntError) -> Self {
        AppError::Parse(e)
    }
}
```

## `thiserror` — Derive Error

```toml
# Cargo.toml
[dependencies]
thiserror = "1.0"
```

```rust
use thiserror::Error;

#[derive(Error, Debug)]
enum DataStoreError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    
    #[error("Key not found: {key}")]
    NotFound { key: String },
    
    #[error("Invalid data: {0}")]
    InvalidData(String),
    
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}
```

## `anyhow` — Application Errors

```toml
# Cargo.toml
[dependencies]
anyhow = "1.0"
```

```rust
use anyhow::{Context, Result};

fn read_config() -> Result<String> {
    let content = std::fs::read_to_string("config.toml")
        .context("Failed to read config file")?;
    Ok(content)
}

fn parse_config(content: &str) -> Result<Config> {
    toml::from_str(content)
        .context("Failed to parse config")
}

fn main() -> Result<()> {
    let config = read_config()
        .and_then(|c| parse_config(&c))?;
    println!("Config loaded: {:?}", config);
    Ok(())
}
```

## Error Handling Patterns

### Pattern 1: Propagate with `?`

```rust
fn process() -> Result<(), MyError> {
    let data = read_file()?;
    let parsed = parse(&data)?;
    save(parsed)?;
    Ok(())
}
```

### Pattern 2: Convert Errors

```rust
fn main() -> Result<(), Box<dyn std::error::Error>> {
    let file = File::open("data.txt")?; // Box<dyn Error>
    Ok(())
}
```

### Pattern 3: Handle Specifically

```rust
fn main() {
    match read_config() {
        Ok(config) => println!("Config: {:?}", config),
        Err(AppError::NotFound { key }) => println!("Missing: {}", key),
        Err(AppError::Io(e)) => eprintln!("IO: {}", e),
        Err(e) => eprintln!("Other: {}", e),
    }
}
```

### Pattern 4: Recover with `unwrap_or`

```rust
fn main() {
    let value = risky_operation().unwrap_or_else(|_| default_value());
    let value = risky_operation().unwrap_or(default_value);
}
```

## `expect` vs `unwrap`

```rust
fn main() {
    // Panic with custom message
    let f = File::open("file.txt").expect("Failed to open file.txt");
    
    // Panic with default message
    let f = File::open("file.txt").unwrap();
    
    // Better: use ? in functions returning Result
}
```

## Checkpoint

```rust
use std::fs::File;
use std::io::{self, Read};

#[derive(Debug)]
enum AppError {
    Io(io::Error),
    EmptyFile,
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            AppError::Io(e) => write!(f, "IO error: {}", e),
            AppError::EmptyFile => write!(f, "File is empty"),
        }
    }
}

impl From<io::Error> for AppError {
    fn from(e: io::Error) -> Self { AppError::Io(e) }
}

fn read_first_line(path: &str) -> Result<String, AppError> {
    let mut file = File::open(path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    
    let first_line = contents.lines().next()
        .ok_or(AppError::EmptyFile)?
        .to_string();
    
    Ok(first_line)
}

fn main() -> Result<(), AppError> {
    let line = read_first_line("data.txt")?;
    println!("First line: {}", line);
    Ok(())
}
```

## Next

Continue to [08 Testing](./08-testing).