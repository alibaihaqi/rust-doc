---
title: 01 Install Rust
tier: beginner
platform: rust
---

# 01 Install Rust

## Goal

Set up a complete Rust development environment with `rustup`, `cargo`, and `rust-analyzer`.

## Steps

### 1. Install rustup

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Follow the prompts (default is fine). This installs:
- `rustc` - the compiler
- `cargo` - package manager and build tool
- `rustup` - toolchain manager

### 2. Configure Shell

```bash
source ~/.cargo/env
```

Verify:

```bash
rustc --version
cargo --version
rustup --version
```

### 3. Install Components

```bash
rustup component add rust-analyzer rust-src rustfmt clippy
```

### 4. Update Toolchain

```bash
rustup update
```

## Checkpoint

Run:

```bash
cargo new hello
cd hello
cargo run
```

Expected output:

```
   Compiling hello v0.1.0 (...)
    Finished dev [unoptimized + debuginfo] target(s) in 0.5s
     Running `target/debug/hello`
Hello, world!
```

## Next

Continue to [02 Hello World](./02-hello-world).