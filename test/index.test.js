import { test } from "node:test";
import assert from "node:assert";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkAside from "../index.js";

async function processMarkdown(markdown) {
  const result = await remark()
    .use(remarkAside)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);
  return result.toString();
}

test("converts basic callout to aside element", async () => {
  const markdown = `> [!note]
> This is a note`;
  
  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    '<aside class="note">\n<p>This is a note</p>\n</aside>'
  );
});

test("converts callout with text on same line", async () => {
  const markdown = `> [!warning] Be careful
> This is dangerous`;
  
  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    '<aside class="warning">\n<p>Be careful\nThis is dangerous</p>\n</aside>'
  );
});

test("handles multiple callouts", async () => {
  const markdown = `> [!note]
> First note

> [!tip]
> A helpful tip`;
  
  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    '<aside class="note">\n<p>First note</p>\n</aside>\n<aside class="tip">\n<p>A helpful tip</p>\n</aside>'
  );
});

test("preserves regular blockquotes", async () => {
  const markdown = `> This is a regular blockquote
> without callout syntax`;
  
  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    '<blockquote>\n<p>This is a regular blockquote\nwithout callout syntax</p>\n</blockquote>'
  );
});

test("handles mixed content", async () => {
  const markdown = `> [!info]
> Important information

> Regular blockquote

> [!warning]
> Warning message`;
  
  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    '<aside class="info">\n<p>Important information</p>\n</aside>\n<blockquote>\n<p>Regular blockquote</p>\n</blockquote>\n<aside class="warning">\n<p>Warning message</p>\n</aside>'
  );
});

test("handles different callout types", async () => {
  const types = ["note", "tip", "info", "warning", "danger", "success"];
  
  for (const type of types) {
    const markdown = `> [!${type}]
> Test content`;
    
    const result = await processMarkdown(markdown);
    assert.strictEqual(
      result,
      `<aside class="${type}">\n<p>Test content</p>\n</aside>`
    );
  }
});

test("handles multiline callout content", async () => {
  const markdown = `> [!note]
> Line one
> Line two
> 
> Line four after blank line`;
  
  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    '<aside class="note">\n<p>Line one\nLine two</p>\n<p>Line four after blank line</p>\n</aside>'
  );
});

test("case sensitivity - converts callout type to lowercase", async () => {
  const markdown = `> [!WARNING]
> This should work`;
  
  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    '<aside class="warning">\n<p>This should work</p>\n</aside>'
  );
});