---
title: 02 Error Handling
tier: intermediate
platform: rust
---

# 02 Error Handling

## Goal

Handle errors idiomatically with custom error types, `thiserror`, `anyhow`, and proper error propagation.

## Result and Option Recap

```rust
fn divide(a: f64, b: f64) -> Option<f64> {
    if b == 0.0 { None } else { Some(a / b) }
}

fn divide_result(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 { Err("division by zero".into()) } else { Ok(a / b) }
}
```

## Custom Error Types

```rust
use std::fmt;
use std::error::Error;

#[derive(Debug)]
enum MathError {
    DivisionByZero,
    NegativeSquareRoot,
    Overflow,
}

impl fmt::Display for MathError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            MathError::DivisionByZero => write!(f, "division by zero"),
            MathError::NegativeSquareRoot => write!(f, "cannot take square root of negative number"),
            MathError::Overflow => write!(f, "integer overflow"),
        }
    }
}

impl Error for MathError {}

fn sqrt(x: f64) -> Result<f64, MathError> {
    if x < 0.0 { Err(MathError::NegativeSquareRoot) } else { Ok(x.sqrt()) }
}
```

## `thiserror` — Derive Error Implementations

```toml
# Cargo.toml
[dependencies]
thiserror = "1.0"
```

```rust
use thiserror::Error;

#[derive(Error, Debug)]
enum AppError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    
    #[error("Parse error at line {line}: {msg}")]
    Parse { line: usize, msg: String },
    
    #[error("Config error: {0}")]
    Config(#[from] config::ConfigError),
    
    #[error("Database error")]
    Database(#[source] sqlx::Error),
}

fn read_config(path: &str) -> Result<Config, AppError> {
    let content = std::fs::read_to_string(path)?; // auto-converts io::Error
    let config = toml::from_str(&content)?;
    Ok(config)
}
```

## `anyhow` — Easy Error Context

```toml
# Cargo.toml
[dependencies]
anyhow = "1.0"
```

```rust
use anyhow::{Context, Result};

fn process_file(path: &str) -> Result<String> {
    let content = std::fs::read_to_string(path)
        .with_context(|| format!("failed to read {}", path))?;
    
    let parsed = parse(&content)
        .context("failed to parse content")?;
    
    Ok(parsed)
}

fn parse(s: &str) -> Result<i32> {
    s.trim().parse().context("not a valid integer")
}
```

## Error Propagation Patterns

### Early Return with `?`

```rust
fn process() -> Result<(), AppError> {
    let data = fetch_data()?;
    let validated = validate(data)?;
    save(validated)?;
    Ok(())
}
```

### Map and And_then

```rust
fn main() {
    let result: Result<i32, _> = "42".parse();
    let doubled = result.map(|x| x * 2);
    
    let result: Result<i32, _> = "42".parse();
    let doubled = result.and_then(|x| Ok(x * 2));
}
```

### Collecting Results

```rust
fn process_all(items: Vec<String>) -> Result<Vec<i32>, ParseError> {
    items.into_iter()
        .map(|s| s.parse())
        .collect::<Result<Vec<_>, _>>()
}
```

## Error Handling in Libraries vs Applications

| Context | Approach |
|---------|----------|
| **Library** | Custom error types with `thiserror`, exhaustive variants |
| **Application** | `anyhow::Error` for flexibility, context chains |

## Checkpoint

```rust
use thiserror::Error;
use anyhow::Result;

#[derive(Error, Debug)]
enum AppError {
    #[error("file not found: {0}")]
    NotFound(String),
    #[error("permission denied")]
    PermissionDenied,
    #[error(transparent)]
    Io(#[from] std::io::Error),
}

fn read_file_safe(path: &str) -> Result<String, AppError> {
    let metadata = std::fs::metadata(path)?;
    if !metadata.is_file() {
        return Err(AppError::NotFound(path.into()));
    }
    std::fs::read_to_string(path).map_err(AppError::Io)
}

fn main() -> Result<()> {
    let content = read_file_safe("config.txt")
        .context("failed to load config")?;
    println!("Config: {}", content);
    Ok(())
}
```

## Next

Continue to [03 Generic Types](./03-generic-types).