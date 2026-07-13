import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/rust-doc/',
  cleanUrls: true,
  lang: 'en-US',
  lastUpdated: true,
  srcDir: 'src',
  ignoreDeadLinks: true,

  locales: {
    root: {
      label: 'English',
      lang: 'en'
    }
  },
  
  title: 'Rust Documentation',
  description: 'Rust Documentation Collection',

  head: [
    ['link', { rel: 'icon', href: 'https://www.alibaihaqi.com/favicon.ico' }]
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Introduction', link: '/introduction/' },
      { text: 'Beginner', link: '/beginner/' },
      { text: 'Intermediate', link: '/intermediate/' },
      { text: 'Advanced', link: '/advanced/' },
      { text: 'Rust', link: '/rust-language/' }
    ],

    search: {
      provider: 'local',
    },

    footer: {
      copyright: 'Copyright © 2023 - Present by Fadli Al Baihaqi'
    },

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Introduction', link: '/introduction/' },
          { text: 'Getting Started', link: '/introduction/getting-started' }
        ]
      },
      {
        text: 'Beginner',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/beginner/' },
          { text: '01 Install Rust', link: '/beginner/01-install-rust' },
          { text: '02 Hello World', link: '/beginner/02-hello-world' },
          { text: '03 Variables and Mutability', link: '/beginner/03-variables-and-mutability' },
          { text: '04 Data Types', link: '/beginner/04-data-types' },
          { text: '05 Functions', link: '/beginner/05-functions' },
          { text: '06 Control Flow', link: '/beginner/06-control-flow' },
          { text: '07 Ownership', link: '/beginner/07-ownership' },
          { text: '08 References and Borrowing', link: '/beginner/08-references-and-borrowing' },
          { text: '09 Structs', link: '/beginner/09-structs' },
          { text: '10 Enums and Pattern Matching', link: '/beginner/10-enums-and-pattern-matching' },
          { text: '11 Collections', link: '/beginner/11-collections' },
        ]
      },
      {
        text: 'Intermediate',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/intermediate/' },
          { text: '01 Collections Deep Dive', link: '/intermediate/01-collections' },
          { text: '02 Error Handling', link: '/intermediate/02-error-handling' },
          { text: '03 Generic Types', link: '/intermediate/03-generic-types' },
          { text: '04 Traits', link: '/intermediate/04-traits' },
          { text: '05 Lifetimes', link: '/intermediate/05-lifetimes' },
          { text: '06 Modules and Crates', link: '/intermediate/06-modules-and-crates' },
          { text: '07 Automated Tests', link: '/intermediate/07-automated-tests' },
        ]
      },
      {
        text: 'Advanced',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/advanced/' },
          { text: '01 Async/Await', link: '/advanced/01-async-await' },
          { text: '02 Concurrency Primitives', link: '/advanced/02-concurrency' },
          { text: '03 Unsafe Rust', link: '/advanced/03-unsafe-rust' },
          { text: '04 Macros', link: '/advanced/04-macros' },
          { text: '05 FFI and C Interop', link: '/advanced/05-ffi' },
          { text: '06 Performance Tuning', link: '/advanced/06-performance' },
        ]
      },
      {
        text: 'Rust Language',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/rust-language/' },
          { text: '01 Why Rust', link: '/rust-language/01-why-rust' },
          { text: '02 Variables and Types', link: '/rust-language/02-variables-and-types' },
          { text: '03 Ownership and Borrowing', link: '/rust-language/03-ownership-and-borrowing' },
          { text: '04 Structs and Enums', link: '/rust-language/04-structs-and-enums' },
          { text: '05 Pattern Matching', link: '/rust-language/05-pattern-matching' },
          { text: '06 Traits and Generics', link: '/rust-language/06-traits-and-generics' },
          { text: '07 Error Handling', link: '/rust-language/07-error-handling' },
          { text: '08 Testing', link: '/rust-language/08-testing' },
          { text: '09 Concurrency', link: '/rust-language/09-concurrency' },
          { text: '10 Async Programming', link: '/rust-language/10-async-programming' },
          { text: '11 Standard Library Tour', link: '/rust-language/11-standard-library' },
          { text: '12 Macros', link: '/rust-language/12-macros' },
          { text: '13 Unsafe Rust', link: '/rust-language/13-unsafe-rust' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/alibaihaqi' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/alibaihaqi/' }
    ]
  }
})