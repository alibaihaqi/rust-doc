---
title: 13 Unsafe Rust
tier: rust-language
platform: rust
---

# 13 Unsafe Rust

## Goal

Understand when and how to use `unsafe`, raw pointers, FFI boundaries, and maintain soundness.

## The `unsafe` Keyword

`unsafe` enables five "superpowers":

1. **Dereference raw pointers**
2. **Call `unsafe` functions** (including FFI)
3. **Access/modify mutable static variables**
4. **Implement `unsafe` traits** (`Send`, `Sync`)
5. **Access union fields**

```rust
unsafe {
    // Superpowers available here
    let x = *raw_ptr;
}
```

**`unsafe` does NOT disable borrow checking** — it just enables additional capabilities.

## Raw Pointers

```rust
let mut x = 10;
let raw_ptr = &mut x as *mut i32;   // *mut T
let raw_const = &x as *const i32;   // *const T

// Create from integer (rare)
let ptr = 0x1234_usize as *const i32;

// Dereference - UNSAFE
let val = unsafe { *raw_ptr };
```

### Raw Pointer Rules

| Rule | Violation = UB |
|------|----------------|
| Must be aligned | `*mut i32` from odd address |
| Must not be null (unless allowed) | Deref null |
| Must point to valid memory | Use after free |
| Must not outlive allocation | Dangling pointer |
| Mutability: `*mut` for writes | Write through `*const` |

## Unsafe Functions

```rust
unsafe fn dangerous() -> i32 {
    42
}

fn safe_wrapper() -> i32 {
    unsafe { dangerous() } // Caller must uphold invariants
}
```

### FFI Functions

```rust
extern "C" {
    fn abs(input: i32) -> i32;
    fn malloc(size: usize) -> *mut libc::c_void;
}

fn main() {
    unsafe {
        println!("abs(-3) = {}", abs(-3));
    }
}
```

## Unsafe Traits: `Send` and `Sync`

```rust
// Automatically implemented when safe
struct MyType;

// Manual implementation - UNSAFE
use std::marker::PhantomData;
use std::ptr::NonNull;

struct MyBox<T> {
    ptr: NonNull<T>,
    _marker: PhantomData<T>,
}

unsafe impl<T: Send> Send for MyBox<T> {}
unsafe impl<T: Sync> Sync for MyBox<T> {}
```

### When to Implement Manually

- Types with raw pointers
- Types with `UnsafeCell`
- FFI types

## Unions

```rust
union IntOrFloat {
    i: i32,
    f: f32,
}

fn main() {
    let u = IntOrFloat { i: 42 };
    
    // Reading union field - UNSAFE
    unsafe {
        println!("i: {}", u.i);
        println!("f: {}", u.f); // Reinterpretation!
    }
}
```

### Tagged Unions (Recommended)

```rust
enum IntOrFloat {
    Int(i32),
    Float(f32),
}

fn main() {
    let u = IntOrFloat::Int(42);
    match u {
        IntOrFloat::Int(i) => println!("{}", i),
        IntOrFloat::Float(f) => println!("{}", f),
    }
}
```

## Common Patterns

### 1. Implementing `Vec`/`String` Internals

```rust
struct MyVec<T> {
    ptr: *mut T,
    len: usize,
    cap: usize,
}

impl<T> MyVec<T> {
    fn push(&mut self, value: T) {
        if self.len == self.cap {
            self.grow();
        }
        unsafe {
            std::ptr::write(self.ptr.add(self.len), value);
        }
        self.len += 1;
    }
}
```

### 2. Interfacing with C

```rust
#[repr(C)]
struct CStruct {
    a: i32,
    b: f64,
}

extern "C" {
    fn c_function(s: *mut CStruct) -> i32;
}

fn safe_wrapper(s: &mut CStruct) -> i32 {
    unsafe { c_function(s as *mut _) }
}
```

### 3. Performance-Critical Code

```rust
fn copy_memory(dst: &mut [u8], src: &[u8]) {
    assert_eq!(dst.len(), src.len());
    unsafe {
        std::ptr::copy_nonoverlapping(src.as_ptr(), dst.as_mut_ptr(), dst.len());
    }
}
```

## Soundness

**Safe code must never cause undefined behavior**, even when calling unsafe code.

### Safety Invariants

```rust
/// Reads a value from a pointer.
///
/// # Safety
/// - `ptr` must be valid for reads of `T`
/// - `ptr` must be properly aligned
/// - `ptr` must point to a properly initialized `T`
pub unsafe fn read_unchecked<T>(ptr: *const T) -> T {
    std::ptr::read(ptr)
}
```

### Documenting Safety

```rust
/// Creates a slice from a pointer and length.
///
/// # Safety
/// - `ptr` must be valid for reads of `len` elements of `T`
/// - `ptr` must be properly aligned
/// - The memory must not be mutated for the lifetime of the slice
pub unsafe fn from_raw_parts<'a, T>(ptr: *const T, len: usize) -> &'a [T] {
    // ...
}
```

## Tools for Safety

### Miri — UB Detector

```bash
cargo install miri
cargo miri test
cargo miri run
```

### Sanitizers

```bash
# Address Sanitizer
RUSTFLAGS="-Z sanitizer=address" cargo test

# Thread Sanitizer
RUSTFLAGS="-Z sanitizer=thread" cargo test

# Memory Sanitizer
RUSTFLAGS="-Z sanitizer=memory" cargo test
```

### Clippy Lints

```bash
cargo clippy -- -W clippy::undocumented_unsafe_blocks
cargo clippy -- -W clippy::missing_safety_doc
```

## `std::mem` Utilities

```rust
use std::mem::{transmute, MaybeUninit, size_of, align_of, offset_of};

// Transmute - UNSAFE
let float_bits: u32 = unsafe { transmute(3.14_f32) };

// MaybeUninit - for uninitialized memory
let mut uninit = MaybeUninit::<i32>::uninit();
unsafe { uninit.as_mut_ptr().write(42); }
let value = unsafe { uninit.assume_init() };

// Size/alignment
assert_eq!(size_of::<i32>(), 4);
assert_eq!(align_of::<i64>(), 8);
```

## `ManuallyDrop`

```rust
use std::mem::ManuallyDrop;

struct Resource { name: String }

impl Drop for Resource {
    fn drop(&mut self) { println!("Dropping {}", self.name); }
}

fn main() {
    let mut resources = Vec::new();
    resources.push(ManuallyDrop::new(Resource { name: "A".into() }));
    resources.push(ManuallyDrop::new(Resource { name: "B".into() }));
    
    // Drop in reverse order manually
    while let Some(r) = resources.pop() {
        unsafe { ManuallyDrop::drop(&mut r) };
    }
}
```

## Checklist for Unsafe Code

- [ ] Document safety requirements with `# Safety`
- [ ] Keep `unsafe` blocks minimal
- [ ] Test with `cargo miri test`
- [ ] Run with sanitizers in CI
- [ ] Audit dependencies for `unsafe` usage
- [ ] Prefer safe abstractions over raw `unsafe`
- [ ] Use `// SAFETY:` comments explaining why each block is sound

## Checkpoint

```rust
// Safe abstraction over raw pointer
struct RawPtr<T> {
    ptr: *mut T,
}

impl<T> RawPtr<T> {
    // SAFETY: Caller must ensure ptr is valid and aligned
    unsafe fn new(ptr: *mut T) -> Self {
        RawPtr { ptr }
    }
    
    // SAFETY: Self must be valid for reads of T
    unsafe fn read(&self) -> T {
        std::ptr::read(self.ptr)
    }
    
    // SAFETY: Self must be valid for writes of T, no aliasing
    unsafe fn write(&mut self, val: T) {
        std::ptr::write(self.ptr, val)
    }
}

fn main() {
    let mut x = 10;
    let raw = unsafe { RawPtr::new(&mut x) };
    
    unsafe {
        println!("{}", raw.read()); // 10
        raw.write(20);
        println!("{}", raw.read()); // 20
    }
}
```

## Summary

You've completed the **Rust Language** tier — a comprehensive tour from fundamentals to advanced topics!

### Tier Recap

| # | Topic | Key Concepts |
|---|-------|--------------|
| 01 | Why Rust | Philosophy, guarantees, use cases |
| 02 | Variables & Types | `let`, `mut`, scalars, compounds |
| 03 | Ownership & Borrowing | Moves, references, slices |
| 04 | Structs & Enums | Data modeling, methods |
| 05 | Pattern Matching | `match`, `if let`, guards, `@` |
| 06 | Traits & Generics | Abstraction, bounds, objects |
| 07 | Error Handling | `Result`, `Option`, `?`, custom |
| 08 | Testing | Unit, integration, doc, bench |
| 09 | Concurrency | Threads, channels, `Arc`/`Mutex` |
| 10 | Async Programming | `Future`, Tokio, `join!`/`select!` |
| 11 | Standard Library | Collections, I/O, paths, time |
| 12 | Macros | `macro_rules!`, procedural |
| 13 | Unsafe Rust | Raw pointers, FFI, soundness |

### Next Steps

- **Practice**: Build projects using these concepts
- **Explore**: Crates.io ecosystem (serde, tokio, sqlx, etc.)
- **Deepen**: Read "The Rust Reference" and "Rustonomicon"
- **Contribute**: Open source Rust projects

Happy Rustacean coding! 🦀