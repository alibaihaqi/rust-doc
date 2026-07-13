---
title: 09 Concurrency
tier: rust-language
platform: rust
---

# 09 Concurrency

## Goal

Use threads, channels, shared state, and synchronization primitives for concurrent programming.

## Threads

```rust
use std::thread;
use std::time::Duration;

fn main() {
    let handle = thread::spawn(|| {
        for i in 1..10 {
            println!("hi number {} from spawned thread!", i);
            thread::sleep(Duration::from_millis(1));
        }
    });
    
    for i in 1..5 {
        println!("hi number {} from main thread!", i);
        thread::sleep(Duration::from_millis(1));
    }
    
    handle.join().unwrap();
}
```

### Moving Data to Threads

```rust
fn main() {
    let v = vec![1, 2, 3];
    
    let handle = thread::spawn(move || {
        println!("Vector: {:?}", v);
    });
    
    handle.join().unwrap();
}
```

## Channels — Message Passing

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    
    thread::spawn(move || {
        let val = String::from("hi");
        tx.send(val).unwrap();
    });
    
    let received = rx.recv().unwrap();
    println!("Got: {}", received);
}
```

### Multiple Senders

```rust
fn main() {
    let (tx, rx) = mpsc::channel();
    
    let tx1 = tx.clone();
    thread::spawn(move || {
        tx1.send(1).unwrap();
    });
    
    thread::spawn(move || {
        tx.send(2).unwrap();
    });
    
    for received in rx {
        println!("Got: {}", received);
    }
}
```

## Shared State — Mutex

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];
    
    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            *num += 1;
        });
        handles.push(handle);
    }
    
    for handle in handles {
        handle.join().unwrap();
    }
    
    println!("Result: {}", *counter.lock().unwrap()); // 10
}
```

## RwLock — Multiple Readers

```rust
use std::sync::{Arc, RwLock};
use std::thread;

fn main() {
    let data = Arc::new(RwLock::new(vec![1, 2, 3]));
    let mut handles = vec![];
    
    // Multiple readers
    for _ in 0..5 {
        let data = Arc::clone(&data);
        handles.push(thread::spawn(move || {
            let read = data.read().unwrap();
            println!("Read: {:?}", *read);
        }));
    }
    
    // Single writer
    let data = Arc::clone(&data);
    handles.push(thread::spawn(move || {
        let mut write = data.write().unwrap();
        write.push(4);
    }));
    
    for h in handles { h.join().unwrap(); }
}
```

## Condvar — Wait for Condition

```rust
use std::sync::{Arc, Mutex, Condvar};
use std::thread;

fn main() {
    let pair = Arc::new((Mutex::new(false), Condvar::new()));
    let (lock, cvar) = &*pair;
    
    let pair2 = Arc::clone(&pair);
    thread::spawn(move || {
        let (lock, cvar) = &*pair2;
        let mut started = lock.lock().unwrap();
        *started = true;
        cvar.notify_one();
    });
    
    let (lock, cvar) = &*pair;
    let mut started = lock.lock().unwrap();
    while !*started {
        started = cvar.wait(started).unwrap();
    }
    println!("Condition met!");
}
```

## Send and Sync

```rust
// Automatically implemented when safe
struct MyType;

// Manual implementation (UNSAFE)
unsafe impl Send for MyType {}
unsafe impl Sync for MyType {}

// Not Send/Sync: Rc, RefCell, *const T, *mut T
// Send but not Sync: Mutex<T>, RefCell<T>
// Sync but not Send: rare (e.g., thread-local with Sync wrapper)
```

## Scoped Threads (Rust 1.63+)

```rust
use std::thread;

fn main() {
    let mut v = vec![1, 2, 3];
    
    thread::scope(|s| {
        s.spawn(|| {
            println!("First: {:?}", v);
        });
        s.spawn(|| {
            println!("Second: {:?}", v);
        });
    });
    
    println!("Done: {:?}", v);
}
```

## Crossbeam — Advanced Primitives

```toml
# Cargo.toml
[dependencies]
crossbeam = "0.8"
```

```rust
use crossbeam::channel::{bounded, unbounded};
use crossbeam::scope;

fn main() {
    // Bounded channel
    let (tx, rx) = bounded(3);
    
    // Scoped threads
    scope(|s| {
        s.spawn(|_| {
            tx.send(1).unwrap();
        });
    }).unwrap();
}
```

## Checkpoint

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let data = Arc::new(Mutex::new(Vec::new()));
    let mut handles = vec![];
    
    for i in 0..10 {
        let data = Arc::clone(&data);
        handles.push(thread::spawn(move || {
            let mut v = data.lock().unwrap();
            v.push(i * 2);
        }));
    }
    
    for h in handles { h.join().unwrap(); }
    
    let result = data.lock().unwrap();
    println!("{:?}", *result); // [0, 2, 4, ..., 18]
}
```

## Next

Continue to [10 Async Programming](./10-async-programming).