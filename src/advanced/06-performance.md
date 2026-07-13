---
title: 06 Performance Tuning
tier: advanced
platform: rust
---

# 06 Performance Tuning

## Goal

Profile Rust code, understand optimization levels, reduce allocations, and use SIMD for numerical workloads.

## Build Profiles

```toml
# Cargo.toml
[profile.dev]
opt-level = 0
debug = true

[profile.release]
opt-level = 3
debug = false
lto = true          # Link-time optimization
codegen-units = 1   # Better optimization, slower compile
panic = "abort"     # Smaller binaries
```

## Profiling Tools

### `cargo bench` — Microbenchmarks

```rust
// benches/my_bench.rs
use criterion::{black_box, criterion_group, criterion_main, Criterion};

fn fib(n: u64) -> u64 {
    match n { 0 | 1 => n, _ => fib(n-1) + fib(n-2) }
}

fn bench_fib(c: &mut Criterion) {
    c.bench_function("fib 20", |b| b.iter(|| fib(black_box(20))));
}

criterion_group!(benches, bench_fib);
criterion_main!(benches);
```

```toml
# Cargo.toml
[dev-dependencies]
criterion = "0.5"

[[bench]]
name = "my_bench"
harness = false
```

Run: `cargo bench`

### `perf` — CPU Profiling (Linux)

```bash
cargo build --release
perf record -g ./target/release/my_app
perf report
```

### `cargo flamegraph` — Flame Graphs

```bash
cargo install flamegraph
cargo flamegraph --bench my_bench
```

### `valgrind` / `massif` — Memory Profiling

```bash
valgrind --tool=massif ./target/release/my_app
ms_print massif.out.*
```

## Compiler Optimizations

### Inlining

```rust
#[inline]          // Suggest inline
#[inline(always)]  // Force inline (use sparingly)
#[inline(never)]   // Prevent inline
fn hot_function() { ... }
```

### `const` and `const fn`

```rust
const fn fib(n: u64) -> u64 {
    match n { 0 | 1 => n, _ => fib(n-1) + fib(n-2) }
}

const RESULT: u64 = fib(10); // Computed at compile time
```

### Link-Time Optimization (LTO)

```toml
[profile.release]
lto = true          # "fat" LTO
# lto = "thin"     # Thin LTO (faster compile)
```

## Reducing Allocations

### Avoid Unnecessary `Vec`/`String`

```rust
// BAD: allocates new String each call
fn format_name(first: &str, last: &str) -> String {
    format!("{} {}", first, last)
}

// GOOD: write to provided buffer
fn format_name_buf(first: &str, last: &str, buf: &mut String) {
    buf.clear();
    buf.push_str(first);
    buf.push(' ');
    buf.push_str(last);
}
```

### `Cow` — Clone on Write

```rust
use std::borrow::Cow;

fn process(input: &str) -> Cow<str> {
    if input.contains("bad") {
        Cow::Owned(input.replace("bad", "good"))
    } else {
        Cow::Borrowed(input)
    }
}
```

### `Box` vs Stack

```rust
// Large struct on stack
struct Large { data: [u8; 10000] }

// Better: Box to avoid stack overflow
fn create_large() -> Box<Large> {
    Box::new(Large { data: [0; 10000] })
}
```

## SIMD — Single Instruction Multiple Data

### Portable SIMD (std::simd, nightly)

```rust
#![feature(portable_simd)]
use std::simd::{f32x4, SimdFloat};

fn dot_product(a: &[f32], b: &[f32]) -> f32 {
    let mut sum = f32x4::splat(0.0);
    for chunk in a.chunks(4).zip(b.chunks(4)) {
        let a = f32x4::from_slice(chunk.0);
        let b = f32x4::from_slice(chunk.1);
        sum += a * b;
    }
    sum.reduce_sum()
}
```

### `packed_simd` (stable alternative)

```rust
// packed_simd crate
use packed_simd::f32x4;

fn dot_product(a: &[f32], b: &[f32]) -> f32 {
    // similar...
}
```

### Auto-vectorization

```rust
// Help compiler vectorize
fn sum(arr: &[f32]) -> f32 {
    let mut sum = 0.0;
    for &x in arr {
        sum += x;
    }
    sum
}

// Use chunks for explicit vectorization
fn sum_chunks(arr: &[f32]) -> f32 {
    let chunks = arr.chunks_exact(4);
    let rem = chunks.remainder();
    let mut sums = [0.0; 4];
    for chunk in chunks {
        for i in 0..4 { sums[i] += chunk[i]; }
    }
    sums.iter().sum::<f32>() + rem.iter().sum::<f32>()
}
```

## Cache-Friendly Code

### Data Layout

```rust
// BAD: Array of structs (AoS) - scattered access
struct Particle { x: f32, y: f32, vx: f32, vy: f32, mass: f32 }
let particles: Vec<Particle> = ...;

// GOOD: Struct of arrays (SoA) - contiguous access
struct ParticleSystem {
    x: Vec<f32>, y: Vec<f32>,
    vx: Vec<f32>, vy: Vec<f32>,
    mass: Vec<f32>,
}
```

### Prefetching

```rust
use std::hint::prefetch_read_data;

fn process(data: &[u8]) {
    for i in 0..data.len() {
        prefetch_read_data(&data[i + 64]); // Prefetch next cache line
        process_byte(data[i]);
    }
}
```

## Zero-Cost Abstractions

### Iterators vs Loops

```rust
// These compile to identical code
fn sum_iter(v: &[i32]) -> i32 {
    v.iter().sum()
}

fn sum_loop(v: &[i32]) -> i32 {
    let mut s = 0;
    for &x in v { s += x; }
    s
}
```

### Enum Layout Optimization

```rust
// Option<&T> is same size as &T (null pointer optimization)
let opt: Option<&i32> = Some(&5);
assert_eq!(std::mem::size_of_val(&opt), std::mem::size_of::<&i32>());

// NonZero* types
use std::num::NonZeroU32;
let nz = NonZeroU32::new(42).unwrap();
assert_eq!(std::mem::size_of_val(&nz), 4);
```

## Checking Assembly

```bash
# Show assembly for function
cargo rustc --release -- --emit=asm -C target-cpu=native

# Or use cargo-asm
cargo install cargo-asm
cargo asm my_crate::my_function
```

## Checkpoint

```rust
// Before: 15μs/iter
fn process_data(data: &[f64]) -> f64 {
    let mut result = 0.0;
    for chunk in data.chunks(100) {
        let mut chunk_sum = 0.0;
        for &x in chunk {
            chunk_sum += x * x;
        }
        result += chunk_sum.sqrt();
    }
    result
}

// After: 3μs/iter (SoA + SIMD + chunked)
fn process_data_opt(x: &[f64], y: &[f64]) -> f64 {
    // SoA layout: x and y are separate arrays
    // Process with explicit SIMD-friendly chunks
    // ...
    0.0 // placeholder
}
```

## Next

You've completed the **Advanced** tier! Continue to [Rust Language](../rust-language/) for a comprehensive language tour.