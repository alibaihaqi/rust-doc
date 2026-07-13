---
title: 05 Lifetimes
tier: intermediate
platform: rust
---

# 05 Lifetimes

## Goal

Understand lifetime annotations, elision rules, and how to work with references that have complex relationships.

## What Are Lifetimes?

Every reference has a **lifetime** — the scope where it's valid. The borrow checker uses lifetimes to ensure references don't outlive their data.

```rust
fn main() {
    let r;
    {
        let x = 5;
        r = &x;
    } // x dropped here
    // println!("{}", r); // ERROR: x doesn't live long enough
}
```

## Lifetime Annotations

```rust
// Explicit lifetime parameter 'a
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

fn main() {
    let s1 = String::from("long string");
    let s2 = String::from("short");
    let result = longest(&s1, &s2);
    println!("Longest: {}", result);
}
```

### Lifetime Syntax

| Syntax | Meaning |
|--------|---------|
| `&'a T` | Reference with lifetime `'a` |
| `&'a mut T` | Mutable reference with lifetime `'a` |
| `fn foo<'a>(x: &'a str) -> &'a str` | Function with lifetime parameter |

## Lifetime Elision Rules

The compiler applies **three rules** to infer lifetimes automatically:

1. **Each parameter gets its own lifetime**  
   `fn foo(x: &str, y: &str)` → `fn foo<'a, 'b>(x: &'a str, y: &'b str)`

2. **If one input lifetime, it's assigned to all outputs**  
   `fn foo(x: &str) -> &str` → `fn foo<'a>(x: &'a str) -> &'a str`

3. **If `&self`/`&mut self`, its lifetime is assigned to all outputs**  
   `fn method(&self) -> &str` → `fn method<'a>(&'a self) -> &'a str`

```rust
// These are equivalent (elided vs explicit):
fn first_word(s: &str) -> &str;
fn first_word<'a>(s: &'a str) -> &'a str;

fn longest(x: &str, y: &str) -> &str; // ERROR: needs explicit

fn longest<'a>(x: &'a str, y: &'a str) -> &'a str; // OK
```

## Structs with Lifetimes

```rust
struct ImportantExcerpt<'a> {
    part: &'a str,
}

impl<'a> ImportantExcerpt<'a> {
    fn level(&self) -> i32 {
        3
    }
    
    fn announce_and_return_part(&self, announcement: &str) -> &str {
        println!("{}", announcement);
        self.part
    }
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.').next().unwrap();
    let excerpt = ImportantExcerpt { part: first_sentence };
    println!("{}", excerpt.announce_and_return_part("Excerpt:"));
}
```

## Lifetime Bounds

```rust
// T must live at least as long as 'a
fn process<'a, T>(item: &'a T) where T: 'a { }

// 'a: 'b means 'a lives at least as long as 'b
fn compare<'a, 'b>(x: &'a str, y: &'b str) -> &'a str
where
    'a: 'b,
{
    x
}
```

## The `'static` Lifetime

```rust
// String literal lives for entire program
let s: &'static str = "I have a static lifetime";

// Box::leak creates 'static reference
let s = Box::new(String::from("hello"));
let static_ref: &'static str = Box::leak(s);

// 'static bound means no non-'static references inside
fn takes_static<T: 'static>(t: T) { }
```

## Advanced Patterns

### Multiple Lifetimes

```rust
// Different input lifetimes
fn choose<'a, 'b>(first: &'a str, second: &'b str, which: bool) -> &'a str {
    if which { first } else { second } // ERROR: second may not live long enough
}

// Same lifetime required
fn choose<'a>(first: &'a str, second: &'a str, which: bool) -> &'a str {
    if which { first } else { second } // OK
}
```

### Higher-Ranked Trait Bounds (HRTB)

```rust
// for<'a> means "for any lifetime 'a"
fn call_with_ref<F>(f: F) where F: for<'a> Fn(&'a str) {
    f("hello");
}
```

## Common Lifetime Patterns

| Pattern | Use Case |
|---------|----------|
| `&'a T` | Reference tied to struct/input |
| `T: 'a` | Type contains no references shorter than `'a` |
| `'a: 'b` | Lifetime `'a` outlives `'b` |
| `&'static T` | Reference lives for entire program |

## Checkpoint

```rust
struct Parser<'a> {
    input: &'a str,
    position: usize,
}

impl<'a> Parser<'a> {
    fn new(input: &'a str) -> Self {
        Parser { input, position: 0 }
    }
    
    fn next_token(&mut self) -> Option<&'a str> {
        if self.position >= self.input.len() {
            return None;
        }
        let start = self.position;
        while self.position < self.input.len() && !self.input.as_bytes()[self.position].is_ascii_whitespace() {
            self.position += 1;
        }
        let token = &self.input[start..self.position];
        while self.position < self.input.len() && self.input.as_bytes()[self.position].is_ascii_whitespace() {
            self.position += 1;
        }
        Some(token)
    }
}

fn main() {
    let input = "hello world rust";
    let mut parser = Parser::new(input);
    while let Some(token) = parser.next_token() {
        println!("Token: {}", token);
    }
}
```

Output:
```
Token: hello
Token: world
Token: rust
```

## Next

Continue to [06 Modules and Crates](./06-modules-and-crates).