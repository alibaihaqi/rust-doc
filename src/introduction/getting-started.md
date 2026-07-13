---
title: Getting Started
tier: introduction
platform: rust
---

# Getting Started with Rust

## Install Rust

The recommended way to install Rust is through **rustup**:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

After installation, restart your shell or run:

```bash
source ~/.cargo/env
```

Verify the installation:

```bash
rustc --version
cargo --version
```

## Create Your First Project

Use Cargo to create a new binary project:

```bash
cargo new hello_rust
cd hello_rust
```

This creates:
- `Cargo.toml` - package manifest
- `src/main.rs` - your code entry point

## Run Your First Program

```bash
cargo run
```

Expected output:
```
   Compiling hello_rust v0.1.0 (/path/to/hello_rust)
    Finished dev [unoptimized + debuginfo] target(s) in 0.5s
     Running `target/debug/hello_rust`
Hello, world!
```

## Next Steps

Continue to [Beginner](/beginner/) tier to build your first real Rust applications.