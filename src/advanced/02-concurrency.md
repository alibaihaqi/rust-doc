---
title: 02 Concurrency Primitives
tier: advanced
platform: rust
---

# 02 Concurrency Primitives

## Goal

Master `Mutex`, `RwLock`, `Arc`, channels, and the `crossbeam`/`rayon` crates for parallel processing.

## Thread-Safe Shared State

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];
    
    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        handles.push(thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            *num += 1;
        }));
    }
    
    for h in handles { h.join().unwrap(); }
    println!("Result: {}", *counter.lock().unwrap());
}
```

## `RwLock` — Multiple Readers, Single Writer

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

## Channels — Message Passing

### Standard Library `std::sync::mpsc`

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    
    thread::spawn(move || {
        let val = String::from("hi");
        tx.send(val).unwrap();
        // val moved, can't use here
    });
    
    let received = rx.recv().unwrap();
    println!("Got: {}", received);
}
```

### Multiple Producers

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    
    for i in 0..5 {
        let tx = tx.clone();
        thread::spawn(move || {
            tx.send(i).unwrap();
        });
    }
    
    drop(tx); // Important: close sender in main
    
    for received in rx {
        println!("Got: {}", received);
    }
}
```

### Bounded Channels with `crossbeam`

```rust
use crossbeam::channel::bounded;
use std::thread;

fn main() {
    let (tx, rx) = bounded(3); // capacity 3
    
    thread::spawn(move || {
        for i in 0..10 {
            tx.send(i).unwrap(); // blocks when full
        }
    });
    
    for _ in 0..10 {
        println!("Received: {}", rx.recv().unwrap());
    }
}
```

## `crossbeam` — Scoped Threads

```rust
use crossbeam::scope;

fn main() {
    let mut data = vec![1, 2, 3, 4, 5];
    
    scope(|s| {
        for i in 0..5 {
            s.spawn(move |_| {
                data[i] *= 2;
            });
        }
    }).unwrap();
    
    println!("{:?}", data); // [2, 4, 6, 8, 10]
}
```

## `rayon` — Data Parallelism

```rust
use rayon::prelude::*;

fn main() {
    let mut data: Vec<i32> = (0..1_000_000).collect();
    
    // Parallel sort
    data.par_sort();
    
    // Parallel map
    let sum: i32 = data.par_iter().map(|x| x * 2).sum();
    
    // Parallel filter
    let evens: Vec<_> = data.par_iter().filter(|x| *x % 2 == 0).collect();
    
    // Parallel reduce
    let max = data.par_iter().max();
}
```

## Atomics — Lock-Free

```rust
use std::sync::atomic::{AtomicUsize, Ordering};
use std::thread;

fn main() {
    let counter = AtomicUsize::new(0);
    
    let handles: Vec<_> = (0..10).map(|_| {
        let counter = &counter;
        thread::spawn(move || {
            for _ in 0..1000 {
                counter.fetch_add(1, Ordering::Relaxed);
            }
        })
    }).collect();
    
    for h in handles { h.join().unwrap(); }
    println!("Count: {}", counter.load(Ordering::Relaxed));
}
```

### Atomic Orderings

| Ordering | Use Case |
|----------|----------|
| `Relaxed` | No ordering guarantees, fastest |
| `Acquire` | Load - synchronizes with Release store |
| `Release` | Store - synchronizes with Acquire load |
| `AcqRel` | Both acquire and release |
| `SeqCst` | Sequential consistency, slowest |

## Async Mutex (Tokio)

```rust
use tokio::sync::Mutex;
use std::sync::Arc;

#[tokio::main]
async fn main() {
    let data = Arc::new(Mutex::new(Vec::new()));
    
    let mut handles = vec![];
    for i in 0..10 {
        let data = Arc::clone(&data);
        handles.push(tokio::spawn(async move {
            let mut lock = data.lock().await;
            lock.push(i);
        }));
    }
    
    for h in handles { h.await.unwrap(); }
    println!("{:?}", data.lock().await);
}
```

## Checkpoint

```rust
use std::sync::{Arc, Mutex};
use std::thread;
use rayon::prelude::*;

fn main() {
    // Thread-safe counter
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];
    
    for _ in 0..10 {
        let c = Arc::clone(&counter);
        handles.push(thread::spawn(move || {
            for _ in 0..1000 {
                *c.lock().unwrap() += 1;
            }
        }));
    }
    
    for h in handles { h.join().unwrap(); }
    println!("Mutex counter: {}", *counter.lock().unwrap());
    
    // Parallel sum with rayon
    let numbers: Vec<i32> = (1..=1_000_000).collect();
    let sum: i32 = numbers.par_iter().sum();
    println!("Parallel sum: {}", sum);
}
```

## Next

Continue to [03 Unsafe Rust](./03-unsafe-rust).