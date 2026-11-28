import type { CategoryEntry } from '../registry';
import { more, sections } from './sections';
import * as ApprovalBar from '../demos/approval-bar';
import * as ContextMeter from '../demos/context-meter';
import * as Conversation from '../demos/conversation';
import * as Markdown from '../demos/markdown';
import * as Message from '../demos/message';
import * as PromptInput from '../demos/prompt-input';
import * as Reasoning from '../demos/reasoning';
import * as ToolCall from '../demos/tool-call';
import * as ToolGroup from '../demos/tool-group';

export const CHAT: CategoryEntry = {
  slug: 'chat',
  label: 'Chat',
  description: 'The conversation, messages, markdown answers, tool calls and the composer.',
  components: [
    {
      slug: 'conversation',
      name: 'Conversation',
      description:
        'The message column: stays at the newest message while you read the end, with a jump back when you scroll up.',
      exports: ['Conversation', 'Message'],
      parts: [],
      demos: [...sections(Conversation), ...more('Message', Message)],
    },
    {
      slug: 'markdown',
      name: 'Markdown',
      description: 'A markdown answer with highlighted code and tables, safe to stream.',
      exports: ['Markdown'],
      parts: ['CodeBlock', 'InlineCode', 'Table'],
      demos: sections(Markdown),
    },
    {
      slug: 'prompt-input',
      name: 'PromptInput',
      description:
        'The composer: a growing text field with attach and footer slots, Send and Stop.',
      exports: ['PromptInput'],
      parts: [],
      demos: sections(PromptInput),
    },
    {
      slug: 'tool-call',
      name: 'ToolCall',
      description:
        'One tool call as a 32 px row that opens its input and output; ToolGroup folds a run of them.',
      exports: ['ToolCall', 'ToolGroup'],
      parts: ['StatusGlyph', 'Disclosure'],
      demos: [...sections(ToolCall), ...more('ToolGroup', ToolGroup)],
    },
    {
      slug: 'approval-bar',
      name: 'ApprovalBar',
      description: 'Allow once, in this session, always, or skip one tool call.',
      exports: ['ApprovalBar'],
      parts: ['Button'],
      demos: sections(ApprovalBar),
    },
    {
      slug: 'reasoning',
      name: 'Reasoning',
      description: 'One line for the thinking time, with the thought folded under it.',
      exports: ['Reasoning'],
      parts: ['Disclosure'],
      demos: sections(Reasoning),
    },
    {
      slug: 'context-meter',
      name: 'ContextMeter',
      description: 'A ring meter for the context window: neutral, warning, then danger.',
      exports: ['ContextMeter'],
      parts: [],
      demos: sections(ContextMeter),
    },
  ],
};
