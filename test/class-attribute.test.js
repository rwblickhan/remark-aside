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

test("adds class attribute matching callout type", async () => {
  const markdown = `> [!note]
> This is a note`;

  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    '<aside class="note">\n<p>This is a note</p>\n</aside>'
  );
});

test("adds class attribute for different callout types", async () => {
  const types = ["warning", "tip", "info", "danger", "success"];

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

test("converts class to lowercase for uppercase callout types", async () => {
  const markdown = `> [!WARNING]
> This should have lowercase class`;

  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    '<aside class="warning">\n<p>This should have lowercase class</p>\n</aside>'
  );
});

test("handles mixed case callout types", async () => {
  const markdown = `> [!Important]
> Mixed case test`;

  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    '<aside class="important">\n<p>Mixed case test</p>\n</aside>'
  );
});

test("handles custom callout types with underscores and numbers", async () => {
  const markdown = `> [!custom_type123]
> Custom callout with underscores and numbers`;

  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    '<aside class="custom_type123">\n<p>Custom callout with underscores and numbers</p>\n</aside>'
  );
});

test("class attribute uses lowercase", async () => {
  const markdown = `> [!MyCustomType]
> Testing consistency`;

  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    '<aside class="mycustomtype">\n<p>Testing consistency</p>\n</aside>'
  );
});

test("multiple callouts have correct individual classes", async () => {
  const markdown = `> [!note]
> First callout

> [!warning]
> Second callout

> [!tip]
> Third callout`;

  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    '<aside class="note">\n<p>First callout</p>\n</aside>\n<aside class="warning">\n<p>Second callout</p>\n</aside>\n<aside class="tip">\n<p>Third callout</p>\n</aside>'
  );
});

test("class works with callout text on same line", async () => {
  const markdown = `> [!info] Important information
> Additional details`;

  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    '<aside class="info">\n<p>Important information\nAdditional details</p>\n</aside>'
  );
});
