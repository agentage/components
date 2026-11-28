'use client';
import { useEffect, useRef, useState } from 'react';
import { Button, Markdown } from '../../src';
import { Block } from '../components/demo';
import { ANSWER } from '../lib/chat-data';

export const Example = () => (
  <Block
    caption="Headings, lists, inline code, links, tables and fenced code highlighted by its language."
    className="max-w-[460px]"
  >
    <Markdown>{ANSWER}</Markdown>
  </Block>
);

const useStream = (text: string) => {
  const [n, setN] = useState(text.length);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearInterval(timer.current), []);
  const play = (): void => {
    window.clearInterval(timer.current);
    setN(0);
    timer.current = window.setInterval(() => {
      setN((v) => {
        if (v >= text.length) window.clearInterval(timer.current);
        return Math.min(text.length, v + 6);
      });
    }, 30);
  };
  return [text.slice(0, n), play] as const;
};

export const States = () => {
  const [shown, play] = useStream(ANSWER);
  return (
    <Block
      caption="Streaming: the same component re-renders with a growing string. Earlier blocks stay in place; nothing flashes."
      className="max-w-[460px]"
    >
      <Button variant="outline" onClick={play} className="mb-3">
        Stream the answer
      </Button>
      <Markdown>{shown}</Markdown>
    </Block>
  );
};

export const Composition = () => (
  <Block
    caption="Raw HTML in the text shows as text; it is never rendered."
    className="max-w-[460px]"
  >
    <Markdown>{'A tag in the answer: <script>alert(1)</script> stays text.'}</Markdown>
  </Block>
);
