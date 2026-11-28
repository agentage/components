import { CodeBlock } from '../../src';

interface CodeProps {
  code: string;
  language?: string;
  className?: string;
}

/** The docs snippet: the package CodeBlock, highlighted at runtime by its language. */
export const Code = ({ code, language, className }: CodeProps) => (
  <CodeBlock code={code} language={language} className={className} />
);
