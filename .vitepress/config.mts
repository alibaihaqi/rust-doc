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
        ]
      },
      {
        text: 'Advanced',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/advanced/' },
        ]
      },
      {
        text: 'Rust Language',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/rust-language/' },
          { text: '01 Why Rust', link: '/rust-language/01-why-rust' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/alibaihaqi' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/alibaihaqi/' }
    ]
  }
})