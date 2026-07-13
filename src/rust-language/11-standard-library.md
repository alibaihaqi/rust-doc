---
title: 11 Standard Library Tour
tier: rust-language
platform: rust
---

# 11 Standard Library Tour

## Goal

Explore key modules in `std`: collections, I/O, strings, paths, time, and system interfaces.

## Collections

### `Vec<T>` — Dynamic Array

```rust
let mut v = Vec::new();
v.push(1);
v.push(2);

let v = vec![1, 2, 3];
let first = &v[0];           // Panic if OOB
let first = v.get(0);        // Option<&T>

for x in &v { /* ... */ }
for x in &mut v { /* ... */ }
```

### `HashMap<K, V>`

```rust
use std::collections::HashMap;

let mut map = HashMap::new();
map.insert("a", 1);
map.insert("b", 2);

map.get("a");                    // Option<&V>
map.entry("c").or_insert(3);     // Insert if absent
map.entry("a").and_modify(|v| *v += 1);
```

### `HashSet<T>` and `BTreeSet<T>`

```rust
use std::collections::{HashSet, BTreeSet};

let mut set = HashSet::new();
set.insert(1);
set.insert(2);

let a: HashSet<_> = [1, 2, 3].into();
let b: HashSet<_> = [2, 3, 4].into();

a.union(&b);            // 1, 2, 3, 4
a.intersection(&b);     // 2, 3
a.difference(&b);       // 1
a.symmetric_difference(&b); // 1, 4
```

### `VecDeque<T>` — Double-Ended Queue

```rust
use std::collections::VecDeque;

let mut dq = VecDeque::new();
dq.push_front(1);
dq.push_back(2);
dq.pop_front();
dq.pop_back();
```

## Strings

### `String` vs `&str`

```rust
let s1 = String::from("hello");  // Owned, heap
let s2: &str = "world";          // Borrowed, static
let s3: &str = &s1;              // Borrow String as &str
```

### Common Operations

```rust
let mut s = String::new();
s.push_str("hello");
s.push(' ');

let s = format!("{} {}", "hello", "world");
let s = "hello".to_string() + " " + "world";

s.trim();                    // Remove whitespace
s.split_whitespace().collect::<Vec<_>>();
s.replace("hello", "hi");
s.starts_with("hel");
s.ends_with("ld");
```

### Iteration

```rust
for c in s.chars() { /* Unicode scalar values */ }
for b in s.bytes() { /* Raw bytes */ }
```

## I/O

### Files

```rust
use std::fs::File;
use std::io::{self, Read, Write, BufReader, BufRead};

fn read_file(path: &str) -> io::Result<String> {
    let mut file = File::open(path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}

fn read_lines(path: &str) -> io::Result<Vec<String>> {
    let file = File::open(path)?;
    let reader = BufReader::new(file);
    reader.lines().collect()
}

fn write_file(path: &str, data: &str) -> io::Result<()> {
    let mut file = File::create(path)?;
    file.write_all(data.as_bytes())?;
    file.flush()?;
    Ok(())
}
```

### Stdin/Stdout

```rust
use std::io::{self, stdin, stdout, Write};

fn main() -> io::Result<()> {
    print!("Enter name: ");
    stdout().flush()?;
    
    let mut name = String::new();
    stdin().read_line(&mut name)?;
    println!("Hello, {}!", name.trim());
    Ok(())
}
```

## Paths

```rust
use std::path::{Path, PathBuf};
use std::fs;

let path = Path::new("/home/user/file.txt");

path.file_name();      // Some("file.txt")
path.extension();      // Some("txt")
path.parent();         // Some("/home/user")
path.join("other.txt"); // "/home/user/other.txt"

fs::read_dir(path)?;   // Iterate directory
fs::metadata(path)?;   // File info
```

## Environment

```rust
use std::env;

env::args().collect::<Vec<_>>();   // Command line args
env::var("HOME");                   // Environment variable
env::set_var("KEY", "value");
env::current_dir()?;
env::temp_dir();
```

## Process

```rust
use std::process::Command;

let output = Command::new("echo")
    .arg("hello")
    .output()?;

println!("stdout: {}", String::from_utf8_lossy(&output.stdout));
println!("stderr: {}", String::from_utf8_lossy(&output.stderr));
println!("status: {}", output.status);

// With pipes
let mut child = Command::new("cat")
    .stdin(std::process::Stdio::piped())
    .stdout(std::process::Stdio::piped())
    .spawn()?;

child.stdin.as_mut().unwrap().write_all(b"input")?;
let output = child.wait_with_output()?;
```

## Time

```rust
use std::time::{Instant, Duration, SystemTime};

let start = Instant::now();
// ... work ...
let elapsed = start.elapsed();
println!("Took: {:?}", elapsed);

let now = SystemTime::now();
let since_epoch = now.duration_since(SystemTime::UNIX_EPOCH)?;
```

## Threads

```rust
use std::thread;
use std::time::Duration;

let handle = thread::spawn(|| {
    for i in 1..10 {
        println!("Thread: {}", i);
        thread::sleep(Duration::from_millis(1));
    }
});

for i in 1..5 {
    println!("Main: {}", i);
    thread::sleep(Duration::from_millis(1));
}

handle.join().unwrap();
```

## Common Traits

| Trait | Purpose | Derive? |
|-------|---------|---------|
| `Debug` | `{:?}` formatting | Yes |
| `Display` | `{}` formatting | No |
| `Clone` | `.clone()` explicit copy | Yes |
| `Copy` | Implicit copy (stack only) | Yes |
| `PartialEq` / `Eq` | `==` comparison | Yes |
| `PartialOrd` / `Ord` | `<`, `>` ordering | Yes |
| `Hash` | Use in HashMap/HashSet | Yes |
| `Default` | `T::default()` | Yes |
| `From` / `Into` | Conversions | No |
| `AsRef` / `AsMut` | Cheap ref conversions | No |
| `Deref` / `DerefMut` | Smart pointer deref | No |
| `Drop` | Cleanup on scope exit | No |

## Error Handling

```rust
use std::error::Error;
use std::fmt;

#[derive(Debug)]
struct MyError { details: String }

impl fmt::Display for MyError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "MyError: {}", self.details)
    }
}

impl Error for MyError {}

fn main() -> Result<(), Box<dyn Error>> {
    Err(MyError { details: "oops".into() }.into())
}
```

## Checkpoint

```rust
use std::collections::HashMap;
use std::fs;
use std::path::Path;
use std::io::{self, Write};

fn count_words(file: &Path) -> io::Result<HashMap<String, usize>> {
    let contents = fs::read_to_string(file)?;
    let mut counts = HashMap::new();
    
    for word in contents.split_whitespace() {
        *counts.entry(word.to_lowercase()).or_insert(0) += 1;
    }
    
    Ok(counts)
}

fn main() -> io::Result<()> {
    let counts = count_words(Path::new("input.txt"))?;
    
    let mut items: Vec<_> = counts.iter().collect();
    items.sort_by_key(|&(_, count)| std::cmp::Reverse(count));
    
    for (word, count) in items.iter().take(10) {
        println!("{}: {}", word, count);
    }
    
    Ok(())
}
```

## Next

Continue to [12 Macros](./12-macros).