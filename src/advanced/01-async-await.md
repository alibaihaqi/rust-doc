---
title: 01 Async/Await
tier: advanced
platform: rust
---

# 01 Async/Await

## Goal

Write asynchronous code with `async`/`await`, understand `Future`, and use the Tokio runtime effectively.

## The `Future` Trait

```rust
trait Future {
    type Output;
    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>;
}

enum Poll<T> {
    Ready(T),
    Pending,
}
```

## `async`/`await` Basics

```rust
async fn fetch_data() -> String {
    // Simulates async work
    tokio::time::sleep(Duration::from_millis(100)).await;
    "data".to_string()
}

async fn process() {
    let data = fetch_data().await; // suspends until ready
    println!("Got: {}", data);
}

#[tokio::main]
async fn main() {
    process().await;
}
```

## Running Multiple Futures Concurrently

```rust
use tokio::join;

async fn fetch_user(id: u32) -> String {
    tokio::time::sleep(Duration::from_millis(100)).await;
    format!("User {}", id)
}

async fn fetch_posts(user_id: u32) -> Vec<String> {
    tokio::time::sleep(Duration::from_millis(100)).await;
    vec!["post1".into(), "post2".into()]
}

async fn main() {
    // Sequential (slow)
    let user = fetch_user(1).await;
    let posts = fetch_posts(1).await;
    
    // Concurrent (fast) - join!
    let (user, posts) = join!(fetch_user(1), fetch_posts(1));
    
    // Concurrent with many - join_all
    let users: Vec<_> = (1..=10).map(fetch_user).collect();
    let results = futures::future::join_all(users).await;
}
```

## `select!` — Race Multiple Futures

```rust
use tokio::select;

async fn race() {
    let slow = async {
        tokio::time::sleep(Duration::from_secs(10)).await;
        "slow"
    };
    
    let fast = async {
        tokio::time::sleep(Duration::from_millis(100)).await;
        "fast"
    };
    
    select! {
        result = slow => println!("Slow won: {}", result),
        result = fast => println!("Fast won: {}", result),
    }
}
```

## Spawning Tasks

```rust
#[tokio::main]
async fn main() {
    // Spawn on runtime - runs concurrently
    let handle = tokio::spawn(async {
        tokio::time::sleep(Duration::from_millis(500)).await;
        println!("Background task done");
    });
    
    // Do other work...
    println!("Main continues");
    
    // Wait for spawned task
    handle.await.unwrap();
}
```

## Async Streams

```rust
use futures::stream::{self, StreamExt};

async fn stream_example() {
    let stream = stream::iter(1..=5)
        .then(|x| async move {
            tokio::time::sleep(Duration::from_millis(100)).await;
            x * 2
        });
    
    // Collect all
    let results: Vec<_> = stream.collect().await;
    println!("{:?}", results); // [2, 4, 6, 8, 10]
}
```

## Channels — Communicating Between Tasks

```rust
use tokio::sync::mpsc;

#[tokio::main]
async fn main() {
    let (tx, mut rx) = mpsc::channel::<String>(32);
    
    // Producer
    tokio::spawn(async move {
        for i in 0..10 {
            tx.send(format!("message {}", i)).await.unwrap();
        }
    });
    
    // Consumer
    while let Some(msg) = rx.recv().await {
        println!("Received: {}", msg);
    }
}
```

## Shared State — `Arc<Mutex<T>>` vs `Arc<RwLock<T>>`

```rust
use std::sync::{Arc, Mutex};
use tokio::sync::Mutex as AsyncMutex;

#[tokio::main]
async fn main() {
    // For async code, prefer async Mutex
    let data = Arc::new(AsyncMutex::new(Vec::new()));
    
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

## Timeout and Cancellation

```rust
use tokio::time::{timeout, Duration};

async fn slow_operation() -> String {
    tokio::time::sleep(Duration::from_secs(10)).await;
    "done".to_string()
}

#[tokio::main]
async fn main() {
    match timeout(Duration::from_secs(1), slow_operation()).await {
        Ok(result) => println!("Success: {}", result),
        Err(_) => println!("Timed out!"),
    }
}
```

## Checkpoint

```rust
use tokio::time::{sleep, Duration};
use tokio::join;

async fn fetch(id: u32) -> String {
    sleep(Duration::from_millis(100)).await;
    format!("Item {}", id)
}

#[tokio::main]
async fn main() {
    // Concurrent fetch
    let (a, b, c) = join!(fetch(1), fetch(2), fetch(3));
    println!("{}, {}, {}", a, b, c);
    
    // Stream processing
    use futures::stream::StreamExt;
    let stream = futures::stream::iter(1..=5)
        .map(fetch)
        .buffer_unordered(3); // max 3 concurrent
    
    let items: Vec<_> = stream.collect().await;
    println!("Stream: {:?}", items);
}
```

## Next

Continue to [02 Concurrency Primitives](./02-concurrency).