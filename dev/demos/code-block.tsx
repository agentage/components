'use client';
import { CodeBlock, InlineCode } from '../../src';
import { Block } from '../components/demo';

const TS = `import { defineCheck } from '@agentage/platform';

// Checks run in order. A failed check stops the start and prints the reason.
export const hasHealth = defineCheck({
  name: 'health-route',
  async run({ manifest }) {
    const ok = manifest.routes.some((r) => r.path === '/health');
    return ok ? { pass: true } : { pass: false, reason: 'missing /health' };
  },
});`;

const YAML = `id: logs
version: 1.2.0
routes:
  - path: /health
    public: true
env:
  LOG_LEVEL: "info"   # debug | info | warn`;

const DIFF = `--- a/extension.yaml
+++ b/extension.yaml
@@ -1,4 +1,4 @@
 id: logs
-version: 1.1.0
+version: 1.2.0
 role: service
+checks: [health-route]`;

const LONG = Array.from(
  { length: 24 },
  (_, i) => `${String(i + 1).padStart(2, '0')}  step ${String(i + 1)} finished`
).join('\n');

export const Example = () => (
  <Block caption="A block with the language label and a copy button. A known language is highlighted at runtime.">
    <CodeBlock language="typescript" code={TS} />
  </Block>
);

export const Variants = () => (
  <div className="space-y-5">
    <Block caption="The same palette for every language: bash, yaml and json here.">
      <div className="grid gap-3">
        <CodeBlock
          language="bash"
          code={`# run the check, then start it\nagentage extension check --only health-route\necho "exit: $?"`}
        />
        <CodeBlock language="yaml" code={YAML} />
        <CodeBlock
          language="json"
          code={`{ "id": "logs", "status": "ok", "checks": 3, "warnings": null }`}
        />
      </div>
    </Block>
    <Block caption="A diff gives added and removed lines a faint line background.">
      <CodeBlock language="diff" code={DIFF} />
    </Block>
    <Block caption="The children slot takes your own tokens; runtime highlighting is skipped then.">
      <CodeBlock code="npm test">
        <code className="font-mono text-foreground">
          <span className="text-primary-emphasis">npm</span> test
        </code>
      </CodeBlock>
    </Block>
    <Block caption="InlineCode sets a short snippet inside running text.">
      <p className="text-ui">
        Use <InlineCode>npm test</InlineCode> before you publish.
      </p>
    </Block>
  </div>
);

export const States = () => (
  <div className="space-y-5">
    <Block caption="Long lines scroll inside the block, and the block stops at 320 px with an inner scroll.">
      <CodeBlock language="text" code={`${LONG}\n${'a long line that keeps going '.repeat(8)}`} />
    </Block>
    <Block caption="Show copy off hides the copy button. An unknown language shows plain text.">
      <CodeBlock language="text" showCopy={false} code="plain text, no colours" />
    </Block>
  </div>
);
