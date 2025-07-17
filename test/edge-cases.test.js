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

test("handles empty callout", async () => {
  const markdown = `> [!note]`;

  const result = await processMarkdown(markdown);
  assert.strictEqual(result, '<aside class="note">\n</aside>');
});

test("handles callout with only whitespace", async () => {
  const markdown = `> [!info]
>    
>   `;

  const result = await processMarkdown(markdown);
  assert.strictEqual(result, '<aside class="info">\n</aside>');
});

test("ignores malformed callout syntax", async () => {
  const markdown = `> [!note
> Missing closing bracket`;

  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    "<blockquote>\n<p>[!note\nMissing closing bracket</p>\n</blockquote>"
  );
});

test("ignores callout without exclamation mark", async () => {
  const markdown = `> [note]
> Should remain blockquote`;

  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    "<blockquote>\n<p>[note]\nShould remain blockquote</p>\n</blockquote>"
  );
});

test("handles callout type with numbers and underscores", async () => {
  const markdown = `> [!custom_type123]
> Custom callout`;

  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    '<aside class="custom_type123">\n<p>Custom callout</p>\n</aside>'
  );
});

test("handles callout with special characters in content", async () => {
  const markdown = `> [!note]
> Content with **bold**, *italic*, and \`code\``;

  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    '<aside class="note">\n<p>Content with <strong>bold</strong>, <em>italic</em>, and <code>code</code></p>\n</aside>'
  );
});

test("handles nested blockquotes inside callout", async () => {
  const markdown = `> [!quote]
> > This is a nested quote
> > inside a callout`;

  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    '<aside class="quote">\n<blockquote>\n<p>This is a nested quote\ninside a callout</p>\n</blockquote>\n</aside>'
  );
});

test("handles empty blockquote", async () => {
  const markdown = `>`;

  const result = await processMarkdown(markdown);
  assert.strictEqual(result, "<blockquote>\n</blockquote>");
});

test("handles callout with links and other markdown", async () => {
  const markdown = `> [!info]
> Check out [this link](https://example.com)
> 
> - Item 1
> - Item 2`;

  const result = await processMarkdown(markdown);
  assert.strictEqual(
    result,
    '<aside class="info">\n<p>Check out <a href="https://example.com">this link</a></p>\n<ul>\n<li>Item 1</li>\n<li>Item 2</li>\n</ul>\n</aside>'
  );
});

test("preserves existing data properties", async () => {
  const processor = remark()
    .use(() => {
      return (tree) => {
        tree.children.forEach((child) => {
          if (child.type === "blockquote") {
            child.data = { existingProp: "value" };
          }
        });
      };
    })
    .use(remarkAside);

  const tree = processor.parse(`> [!note]
> Test`);
  processor.runSync(tree);

  const blockquote = tree.children[0];
  assert.strictEqual(blockquote.data.hName, "aside");
  assert.strictEqual(blockquote.data.existingProp, "value");
});
