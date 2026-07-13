---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Rust Documentation"
  tagline: Part of the Learning Docs hub.
  actions:
    - theme: brand
      text: Introduction
      link: /introduction/
    - theme: alt
      text: Getting Started
      link: /introduction/getting-started
    - theme: alt
      text: Hub
      link: https://alibaihaqi.github.io/learning-docs/

features:
  - title: Beginner tier
    details: Ladder from zero to a working CLI tool built on std — ownership, enums, error handling.
    link: /beginner/
  - title: Intermediate tier
    details: Collections mastery, custom errors, generics, traits, lifetimes, modules, testing.
    link: /intermediate/
  - title: Advanced tier
    details: Async/await, concurrency primitives, unsafe, macros, FFI, performance tuning.
    link: /advanced/
  - title: Rust Language
    details: From zero-cost abstractions to unsafe — a complete tour of the Rust programming language.
    link: /rust-language/
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #f97316 30%, #fb923c);
  --vp-home-hero-name-background-image: linear-gradient(-45deg, #f97316 50%, #fb923c 50%);
}
</style>