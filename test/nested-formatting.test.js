import { test } from "node:test";
import assert from "node:assert";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import rehypeStringify from "rehype-stringify";
import remarkAside from "../index.js";

async function processMarkdown(markdown) {
  const result = await remark()
    .use(remarkAside)
    .use(remarkRehype)
    .use(remarkGfm)
    .use(rehypeStringify)
    .process(markdown);
  return result.toString();
}

test("handles strong formatting inside aside block", async () => {
  const markdown = `> [!note]
> This text has **strong formatting** in it`;

  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    '<aside class="note">\n<p>This text has <strong>strong formatting</strong> in it</p>\n</aside>'
  );
});

test("handles emphasis formatting inside aside block", async () => {
  const markdown = `> [!tip]
> This text has *emphasized text* in it`;

  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    '<aside class="tip">\n<p>This text has <em>emphasized text</em> in it</p>\n</aside>'
  );
});

test("handles both strong and emphasis formatting together", async () => {
  const markdown = `> [!warning]
> This has **strong** and *emphasis* formatting`;

  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    '<aside class="warning">\n<p>This has <strong>strong</strong> and <em>emphasis</em> formatting</p>\n</aside>'
  );
});

test("handles nested strong inside emphasis", async () => {
  const markdown = `> [!info]
> This has *emphasis with **nested strong** inside*`;

  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    '<aside class="info">\n<p>This has <em>emphasis with <strong>nested strong</strong> inside</em></p>\n</aside>'
  );
});

test("handles nested emphasis inside strong", async () => {
  const markdown = `> [!danger]
> This has **strong with *nested emphasis* inside**`;

  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    '<aside class="danger">\n<p>This has <strong>strong with <em>nested emphasis</em> inside</strong></p>\n</aside>'
  );
});

test("handles multiple formatting elements in one line", async () => {
  const markdown = `> [!success]
> **Bold**, *italic*, \`code\`, and [link](https://example.com)`;

  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    '<aside class="success">\n<p><strong>Bold</strong>, <em>italic</em>, <code>code</code>, and <a href="https://example.com">link</a></p>\n</aside>'
  );
});

test("handles formatting across multiple lines", async () => {
  const markdown = `> [!note]
> First line with **strong text**
> Second line with *emphasized text*
> Third line with \`inline code\``;

  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    '<aside class="note">\n<p>First line with <strong>strong text</strong>\nSecond line with <em>emphasized text</em>\nThird line with <code>inline code</code></p>\n</aside>'
  );
});

test("handles formatting in callout with text on same line", async () => {
  const markdown = `> [!tip] **Important tip**
> Make sure to *remember* this \`code example\``;

  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    '<aside class="tip">\n<p><strong>Important tip</strong>\nMake sure to <em>remember</em> this <code>code example</code></p>\n</aside>'
  );
});

test("handles complex nested formatting combinations", async () => {
  const markdown = `> [!warning]
> ***Bold and italic*** text with \`code\`
> **Bold with *nested italic* and \`code\`**
> *Italic with **nested bold** text*`;

  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    '<aside class="warning">\n<p><em><strong>Bold and italic</strong></em> text with <code>code</code>\n<strong>Bold with <em>nested italic</em> and <code>code</code></strong>\n<em>Italic with <strong>nested bold</strong> text</em></p>\n</aside>'
  );
});

test("handles strikethrough formatting inside aside block", async () => {
  const markdown = `> [!note]
> This text has ~~strikethrough~~ formatting`;

  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    '<aside class="note">\n<p>This text has <del>strikethrough</del> formatting</p>\n</aside>'
  );
});
