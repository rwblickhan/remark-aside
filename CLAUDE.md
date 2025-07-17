# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a remark plugin that converts Obsidian-style callout markdown syntax into HTML `<aside>` elements. The plugin transforms blockquotes with callout syntax like `> [!note]` into semantic HTML with appropriate CSS classes.

**Core functionality:**
- Input: `> [!note]\n> Content` 
- Output: `<aside class="note"><p>Content</p></aside>`

## Commands

**Testing:**
- `npm test` - Run all unit tests using Node.js built-in test runner
- `npm run demo` - Run the demo script to see plugin output with sample markdown

**Development:**
- No build step required (ES modules)
- No linting configured

## Architecture

**Main plugin file:** `index.js`
- Exports default function that returns a remark transformer
- Uses `unist-util-visit` to traverse AST and find blockquote nodes
- Regex pattern `/^\[!(\w+)\](.*)$/s` matches callout syntax 
- Transforms matching blockquotes to `aside` elements via `hName` and `hProperties`

**Pipeline requirements:**
- Plugin must be used with `remark-rehype` and `rehype-stringify` (not `remark-html`)
- Works by setting `node.data.hName = "aside"` and `node.data.hProperties.className`

**Test structure:**
- `test/index.test.js` - Core functionality tests
- `test/edge-cases.test.js` - Error conditions and edge cases  
- `test/class-attribute.test.js` - Class attribute specific tests
- All tests use Node.js built-in test runner with `processMarkdown()` helper function

**Key implementation details:**
- Callout types are converted to lowercase for CSS classes
- Supports text on same line as callout syntax
- Preserves regular blockquotes that don't match callout pattern
- Handles multiline content and nested markdown within callouts