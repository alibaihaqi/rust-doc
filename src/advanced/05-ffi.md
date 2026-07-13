---
title: 05 FFI
tier: advanced
platform: rust
---

# 05 FFI & C Interop

## Goal

Call C from Rust and Rust from C using `extern "C"`, `bindgen`, `cxx`, and safely pass data across the FFI boundary.

## Calling C from Rust

### Basic FFI

```rust
// Rust calling C
extern "C" {
    fn abs(input: i32) -> i32;
    fn sqrt(x: f64) -> f64;
}

fn main() {
    unsafe {
        println!("abs(-10) = {}", abs(-10));
        println!("sqrt(4.0) = {}", sqrt(4.0));
    }
}
```

### Linking C Library

```toml
# Cargo.toml
[build-dependencies]
cc = "1.0"
```

```rust
// build.rs
fn main() {
    cc::Build::new()
        .file("src/mylib.c")
        .compile("mylib");
    
    println!("cargo:rustc-link-lib=static=mylib");
    println!("cargo:rustc-link-search=native=.");
}
```

```c
// src/mylib.c
#include "mylib.h"

int add(int a, int b) {
    return a + b;
}
```

```c
// src/mylib.h
#ifndef MYLIB_H
#define MYLIB_H

#ifdef __cplusplus
extern "C" {
#endif

int add(int a, int b);

#ifdef __cplusplus
}
#endif

#endif
```

```rust
// src/lib.rs
extern "C" {
    fn add(a: i32, b: i32) -> i32;
}

pub fn safe_add(a: i32, b: i32) -> i32 {
    unsafe { add(a, b) }
}
```

## Calling Rust from C

```rust
// src/lib.rs
#[no_mangle]
pub extern "C" fn rust_add(a: i32, b: i32) -> i32 {
    a + b
}

#[no_mangle]
pub extern "C" fn rust_greet(name: *const libc::c_char) {
    let c_str = unsafe { std::ffi::CStr::from_ptr(name) };
    if let Ok(s) = c_str.to_str() {
        println!("Hello, {}!", s);
    }
}
```

```c
// C caller
#include <stdio.h>

int rust_add(int a, int b);
void rust_greet(const char* name);

int main() {
    printf("2 + 3 = %d\n", rust_add(2, 3));
    rust_greet("World");
    return 0;
}
```

## Passing Data Across FFI

### Primitive Types

```rust
extern "C" {
    fn c_function(
        a: i32,           // c_int
        b: u64,           // c_ulonglong
        c: f64,           // c_double
        d: bool,          // c_bool (C99)
    );
}
```

### Strings

```rust
use std::ffi::{CStr, CString};

fn main() {
    // Rust -> C
    let c_str = CString::new("Hello").unwrap();
    unsafe { c_function(c_str.as_ptr()) };
    
    // C -> Rust
    let c_str: *const libc::c_char = get_c_string();
    let rust_str = unsafe { CStr::from_ptr(c_str) }.to_str().unwrap();
}
```

### Structs

```rust
#[repr(C)]  // Guarantees C-compatible layout
pub struct Point {
    x: f64,
    y: f64,
}

extern "C" {
    fn translate(point: *mut Point, dx: f64, dy: f64);
}

fn main() {
    let mut p = Point { x: 1.0, y: 2.0 };
    unsafe { translate(&mut p, 1.0, 1.0) };
}
```

### Vectors/Arrays

```rust
// Passing slice as pointer + length
extern "C" {
    fn process_array(data: *const f64, len: usize);
}

fn main() {
    let data = vec![1.0, 2.0, 3.0];
    unsafe { process_array(data.as_ptr(), data.len()) };
}
```

### Callbacks

```rust
// C function taking callback
extern "C" {
    fn register_callback(cb: extern "C" fn(i32), user_data: *mut libc::c_void);
}

// Rust callback
extern "C" fn my_callback(value: i32) {
    println!("Callback: {}", value);
}

fn main() {
    unsafe { register_callback(my_callback, std::ptr::null_mut()) };
}
```

## Bindgen — Automatic Bindings

```toml
# Cargo.toml
[build-dependencies]
bindgen = "0.60"
```

```rust
// build.rs
fn main() {
    let bindings = bindgen::Builder::default()
        .header("wrapper.h")
        .generate()
        .expect("Unable to generate bindings");
    
    let out_path = std::path::PathBuf::from(std::env::var("OUT_DIR").unwrap());
    bindings
        .write_to_file(out_path.join("bindings.rs"))
        .expect("Couldn't write bindings");
}
```

```rust
// src/lib.rs
include!(concat!(env!("OUT_DIR"), "/bindings.rs"));
```

## `cxx` — Safe C++ Interop

```toml
# Cargo.toml
[dependencies]
cxx = "1.0"
```

```rust
// src/lib.rs
#[cxx::bridge]
mod ffi {
    unsafe extern "C++" {
        include!("my_cpp.h");
        fn cpp_function(x: i32) -> i32;
    }
}

pub fn call_cpp(x: i32) -> i32 {
    ffi::cpp_function(x)
}
```

## Memory Management

### Ownership Transfer

```rust
// C allocates, Rust frees
extern "C" {
    fn c_alloc() -> *mut MyStruct;
    fn c_free(ptr: *mut MyStruct);
}

fn use_c_alloc() {
    let ptr = unsafe { c_alloc() };
    // Use ptr...
    unsafe { c_free(ptr) };
}
```

### Shared Ownership

```rust
use std::sync::Arc;

extern "C" {
    fn c_retain(ptr: *mut MyStruct);
    fn c_release(ptr: *mut MyStruct);
}

struct CRef {
    ptr: *mut MyStruct,
}

impl Drop for CRef {
    fn drop(&mut self) {
        unsafe { c_release(self.ptr) }
    }
}

unsafe impl Send for CRef {}
unsafe impl Sync for CRef {}
```

## Checklist for Safe FFI

- [ ] Use `#[repr(C)]` on all shared structs
- [ ] Match integer sizes exactly (`c_int`, `c_long`, etc.)
- [ ] Use `CString`/`CStr` for strings
- [ ] Document ownership transfer clearly
- [ ] Never leak memory across FFI boundary
- [ ] Test with sanitizers (ASan, MSan)

## Checkpoint

```rust
// Complete example: calling C's qsort from Rust
extern "C" {
    fn qsort(
        base: *mut libc::c_void,
        nmemb: libc::size_t,
        size: libc::size_t,
        compar: extern "C" fn(*const libc::c_void, *const libc::c_void) -> libc::c_int,
    );
}

extern "C" fn compare_ints(a: *const libc::c_void, b: *const libc::c_void) -> libc::c_int {
    let a = unsafe { *(a as *const i32) };
    let b = unsafe { *(b as *const i32) };
    a.cmp(&b) as libc::c_int
}

fn main() {
    let mut data = [5, 2, 8, 1, 9];
    unsafe {
        qsort(
            data.as_mut_ptr() as *mut libc::c_void,
            data.len(),
            std::mem::size_of::<i32>(),
            compare_ints,
        );
    }
    println!("{:?}", data); // [1, 2, 5, 8, 9]
}
```

## Next

Continue to [06 Performance](./06-performance).