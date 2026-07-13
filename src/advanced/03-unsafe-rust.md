---
title: 03 Unsafe Rust
tier: advanced
platform: rust
---

# 03 Unsafe Rust

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

## Raw Pointers

```rust
let mut x = 10;
let raw_ptr = &mut x as *mut i32;   // *mut T
let raw_const = &x as *const i32;   // *const T

// Create from integers (rare)
let ptr = 0x1234_usize as *const i32;

// Dereference - UNSAFE
let val = unsafe { *raw_ptr };
```

### Pointer Safety Rules

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
}

fn main() {
    unsafe { println!("abs(-3) = {}", abs(-3)) };
}
```

## Unsafe Traits: `Send` and `Sync`

```rust
// Automatically implemented when safe
struct MyType;

// Manual implementation - UNSAFE
unsafe impl Send for MyType {}
unsafe impl Sync for MyType {}
```

### When to Implement Manually

```rust
use std::marker::PhantomData;
use std::ptr::NonNull;

struct MyBox<T> {
    ptr: NonNull<T>,
    _marker: PhantomData<T>, // For dropck
}

unsafe impl<T: Send> Send for MyBox<T> {}
unsafe impl<T: Sync> Sync for MyBox<T> {}
```

## Working with Unions

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
// SAFETY: Caller must ensure:
// - ptr is valid for reads of size T
// - ptr is properly aligned
// - T is initialized
unsafe fn read_unchecked<T>(ptr: *const T) -> T {
    std::ptr::read(ptr)
}
```

### Documenting Safety

```rust
/// Reads a value from a pointer.
///
/// # Safety
/// - `ptr` must be valid for reads of `T`
/// - `ptr` must be properly aligned
/// - `ptr` must point to a properly initialized `T`
pub unsafe fn read<T>(ptr: *const T) -> T { ... }
```

## Tools for Safety

### Miri — Undefined Behavior Detector

```bash
cargo install miri
cargo miri test
cargo miri run
```

### Sanitizers

```bash
# Address sanitizer
RUSTFLAGS="-Z sanitizer=address" cargo test

# Thread sanitizer
RUSTFLAGS="-Z sanitizer=thread" cargo test

# Memory sanitizer
RUSTFLAGS="-Z sanitizer=memory" cargo test
```

## `std::mem` Utilities

```rust
use std::mem::{transmute, MaybeUninit, size_of, align_of};

// Transmute - UNSAFE
let float_bits: u32 = unsafe { transmute(3.14_f32) };

// MaybeUninit - for uninitialized memory
let mut uninit = MaybeUninit::<i32>::uninit();
unsafe { uninit.as_mut_ptr().write(42); }
let initialized = unsafe { uninit.assume_init() };

// Offset pointer
let ptr = &mut data as *mut i32;
let second = unsafe { ptr.add(1) }; // ptr + 1 * size_of::<i32>()
```

## Checklist for Unsafe Code

- [ ] Document safety requirements with `# Safety`
- [ ] Use `// SAFETY:` comments explaining why each `unsafe` block is sound
- [ ] Test with `cargo miri test`
- [ ] Run with sanitizers in CI
- [ ] Minimize `unsafe` scope (smallest possible block)
- [ ] Prefer safe abstractions over raw `unsafe`
- [ ] Audit dependencies for `unsafe` usage

## Checkpoint

```rust
// Safe abstraction over raw pointer
struct RawPtr<T> {
    ptr: *mut T,
}

impl<T> RawPtr<T> {
    fn new(ptr: *mut T) -> Self {
        RawPtr { ptr }
    }
    
    // SAFETY: Caller must ensure ptr is valid and aligned
    unsafe fn read(&self) -> T {
        std::ptr::read(self.ptr)
    }
    
    // SAFETY: Caller must ensure ptr is valid, aligned, and not aliased
    unsafe fn write(&mut self, val: T) {
        std::ptr::write(self.ptr, val)
    }
}

fn main() {
    let mut x = 10;
    let raw = RawPtr::new(&mut x);
    
    unsafe {
        println!("{}", raw.read()); // 10
        raw.write(20);
        println!("{}", raw.read()); // 20
    }
}
```

## Next

Continue to [04 Macros](./04-macros).