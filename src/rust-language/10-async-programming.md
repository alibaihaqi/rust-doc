---
title: 10 Async Programming
tier: rust-language
platform: rust
---

# 10 Async Programming

## Goal

Understand `async`/`await`, `Future`, runtimes (Tokio), streams, and async patterns.

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
    // Simulate async work
    tokio::time::sleep(std::time::Duration::from_millis(100)).await;
    "data".to_string()
}

#[tokio::main]
async fn main() {
    let data = fetch_data().await;
    println!("Got: {}", data);
}
```

## `.await` Points

```rust
async fn example() {
    let a = fetch_a().await;  // Suspension point
    let b = fetch_b().await;  // Suspension point
    println!("{} {}", a, b);
}
```

## Concurrent Execution

### `join!` — Run Concurrently

```rust
use tokio::join;

async fn fetch_a() -> String {
    tokio::time::sleep(Duration::from_millis(100)).await;
    "a".to_string()
}

async fn fetch_b() -> String {
    tokio::time::sleep(Duration::from_millis(200)).await;
    "b".to_string()
}

async fn main() {
    let (a, b) = join!(fetch_a(), fetch_b());
    // Takes ~200ms total, not 300ms
}
```

### `select!` — Race Futures

```rust
use tokio::select;

async fn main() {
    let fast = async {
        tokio::time::sleep(Duration::from_millis(50)).await;
        "fast"
    };
    
    let slow = async {
        tokio::time::sleep(Duration::from_millis(500)).await;
        "slow"
    };
    
    select! {
        result = fast => println!("Fast won: {}", result),
        result = slow => println!("Slow won: {}", result),
    }
}
```

### `try_join!` — Error Handling

```rust
use tokio::try_join;

async fn fetch(id: u32) -> Result<String, Error> {
    if id == 0 { return Err(Error::new("invalid")); }
    Ok(format!("data {}", id))
}

async fn main() -> Result<(), Error> {
    let (a, b) = try_join!(fetch(1), fetch(2))?;
    Ok(())
}
```

## Spawning Tasks

```rust
#[tokio::main]
async fn main() {
    // Spawn on runtime
    let handle = tokio::spawn(async {
        tokio::time::sleep(Duration::from_millis(100)).await;
        "task result"
    });
    
    // Do other work...
    
    let result = handle.await.unwrap();
}
```

## Channels

```rust
use tokio::sync::mpsc;

#[tokio::main]
async fn main() {
    let (tx, mut rx) = mpsc::channel(32);
    
    // Producer
    tokio::spawn(async move {
        for i in 0..10 {
            tx.send(i).await.unwrap();
        }
    });
    
    // Consumer
    while let Some(val) = rx.recv().await {
        println!("Got: {}", val);
    }
}
```

## Shared State

```rust
use tokio::sync::Mutex;
use std::sync::Arc;

#[tokio::main]
async fn main() {
    let data = Arc::new(Mutex::new(0));
    let mut handles = vec![];
    
    for _ in 0..10 {
        let data = data.clone();
        handles.push(tokio::spawn(async move {
            let mut lock = data.lock().await;
            *lock += 1;
        }));
    }
    
    for h in handles { h.await.unwrap(); }
    println!("{}", *data.lock().await); // 10
}
```

## Streams

```rust
use futures::stream::{self, StreamExt};

async fn process_stream() {
    let stream = stream::iter(1..=5)
        .map(|x| async move { x * 2 })
        .buffer_unordered(3);
    
    let mut sum = 0;
    futures::pin_mut!(stream);
    while let Some(x) = stream.next().await {
        sum += x;
    }
    println!("Sum: {}", sum); // 30
}
```

## Timeout

```rust
use tokio::time::{timeout, Duration};

async fn slow_operation() -> String {
    tokio::time::sleep(Duration::from_secs(10)).await;
    "done".to_string()
}

#[tokio::main]
async fn main() {
    match timeout(Duration::from_millis(100), slow_operation()).await {
        Ok(result) => println!("{}", result),
        Err(_) => println!("Timed out!"),
    }
}
```

## Cancellation

```rust
use tokio::time::{sleep, Duration};
use tokio_util::sync::CancellationToken;

async fn long_running(token: CancellationToken) {
    loop {
        tokio::select! {
            _ = token.cancelled() => {
                println!("Cancelled!");
                return;
            }
            _ = sleep(Duration::from_millis(100)) => {
                println!("Working...");
            }
        }
    }
}

#[tokio::main]
async fn main() {
    let token = CancellationToken::new();
    let handle = tokio::spawn(long_running(token.clone()));
    
    sleep(Duration::from_millis(500)).await;
    token.cancel();
    handle.await.unwrap();
}
```

## Checkpoint

```rust
use tokio::{join, time::{sleep, Duration}};

async fn fetch_user(id: u32) -> String {
    sleep(Duration::from_millis(100)).await;
    format!("User {}", id)
}

async fn fetch_posts(user_id: u32) -> Vec<String> {
    sleep(Duration::from_millis(200)).await;
    vec![format!("Post by {}", user_id)]
}

#[tokio::main]
async fn main() {
    // Concurrent fetches
    let (user, posts) = join!(
        fetch_user(42),
        fetch_posts(42)
    );
    
    println!("User: {}", user);
    println!("Posts: {:?}", posts);
    
    // Race with timeout
    let slow = async {
        sleep(Duration::from_secs(10)).await;
        "slow"
    };
    
    let fast = async {
        sleep(Duration::from_millis(50)).await;
        "fast"
    };
    
    let result = join!(slow, fast);
    println!("{:?}", result); // fast completes first
}
```

## Next

Continue to [11 Standard Library Tour](./11-standard-library).