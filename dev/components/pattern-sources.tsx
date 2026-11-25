'use client';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../src';
import { patternSource } from '../lib/built-from';
import { Code } from './code';

const lineCount = (code: string): number => code.split('\n').length;

/** One collapsed disclosure per demo file; the closed body keeps its height box, so nothing shifts. */
export const PatternSources = ({ files }: { files: string[] }) => (
  <div className="space-y-2">
    {files.map((file) => {
      const code = patternSource(file);
      return (
        <Collapsible key={file}>
          <CollapsibleTrigger>
            <span className="font-mono text-xs">
              demos/patterns/{file}.tsx, {lineCount(code)} lines
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="w-0 min-w-full">
              <Code
                language="typescript"
                code={code}
                className="[&_pre]:whitespace-pre-wrap [&_pre]:[overflow-wrap:anywhere]"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    })}
  </div>
);
