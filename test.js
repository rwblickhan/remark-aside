import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkAside from "./index.js";

const markdown = `> [!note]
> Blah blah blah

> [!warning]
> This is a warning message

> [!tip]
> Here's a helpful tip

Regular blockquote:
> This should remain a blockquote`;

async function test() {
  const result = await remark()
    .use(remarkAside)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);

  console.log("Input:");
  console.log(markdown);
  console.log("\nOutput:");
  console.log(result.toString());
}

test().catch(console.error);
