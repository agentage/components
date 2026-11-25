'use client';
import { CodeBlock, InlineCode } from '../../src';
import { Block } from '../components/demo';
import { Code } from '../components/code';

export const Example = () => (
  <Block caption="A block with the language label and a copy button.">
    <CodeBlock language="bash" code={`cd my-folder\nnpm install\nnpm test`} />
  </Block>
);

export const Variants = () => (
  <div className="space-y-5">
    <Block caption="The children slot takes your own tokens, so the same chrome can show highlighted code.">
      <Code
        language="typescript"
        code={`interface Report {\n  title: string;\n  owner: string;\n}\n\nconst report: Report = { title: 'Quarterly', owner: 'Ada' };`}
      />
    </Block>
    <Block caption="InlineCode sets a short snippet inside running text.">
      <p className="text-ui">
        Use <InlineCode>npm test</InlineCode> before you publish.
      </p>
    </Block>
  </div>
);

export const States = () => (
  <Block caption="Show copy off hides the copy button.">
    <CodeBlock language="json" showCopy={false} code={`{ "name": "report", "version": "1.0.0" }`} />
  </Block>
);
