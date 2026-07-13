---
title: Advanced
tier: advanced
platform: rust
---

# Advanced Rust Tutorials

Production-ready patterns and systems programming.

## Learning Path

| # | Tutorial | Concepts |
|---|----------|----------|
| 01 | [Async/Await](./01-async-await) | `Future`, `async`/`await`, Tokio runtime, `join!`, `select!` |
| 02 | [Concurrency Primitives](./02-concurrency) | `Mutex`, `RwLock`, `Arc`, channels, `crossbeam`, `rayon` |
| 03 | [Unsafe Rust](./03-unsafe-rust) | `unsafe`, raw pointers, FFI, soundness, Miri |
| 04 | [Macros](./04-macros) | `macro_rules!`, procedural macros, derive/attribute/function-like |
| 05 | [FFI and C Interop](./05-ffi) | `extern "C"`, bindgen, cxx, memory management |
| 06 | [Performance Tuning](./06-performance) | Profiling, SIMD, cache-friendly code, LTO, zero-cost abstractions |

## Prerequisites

- Completed [Intermediate](/intermediate/) tier
- Comfortable with lifetimes, traits, generics

Start with [01 Async/Await](./01-async-await).