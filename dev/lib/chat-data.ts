/** Sample run for the chat pages: one release-notes request, its calls and its answer. */

export const PROMPT =
  'Draft the release notes for kit 14.1.0 from the pull requests merged since v14.0.0. Group them as Features, Fixes and Chores and skip dependency bumps. Then post the draft to #releases and save it to memory.';

export const PLAN =
  'I will find the last tag, list the merged pull requests and reuse the style of earlier notes.';

export const THOUGHT =
  'The last tag is v14.0.0. Compare it with master, then read each merged pull request title and label. Dependency bumps carry the dependencies label, so I filter on it.';

export const SERVERS = ['memory', 'repos', 'tasks', 'chat'];

export const PRESET = ['Agent config', 'Instructions', 'Last 3 runs'];

export const EARLY_STEPS = [
  { name: 'memory.search', summary: 'release notes style', duration: '0.7 s' },
  { name: 'repos.list_tags', summary: 'agentage/platform', duration: '0.7 s' },
  { name: 'repos.compare', summary: 'v14.0.0...master', duration: '1.5 s' },
];

export const PULLS_INPUT = {
  repo: 'agentage/platform',
  state: 'merged',
  since: 'v14.0.0',
  exclude_labels: ['dependencies'],
};

export const PULLS_OUTPUT = `[
  { "n": 419, "title": "fix: long names" },
  { "n": 421, "title": "feat: sheet width" },
  { "n": 422, "title": "fix: just now" },
  ... 8 more
]`;

export const POST_INPUT = {
  channel: '#releases',
  text: 'Release notes: kit 14.1.0 ... (9 changes)',
};

export const ANSWER = `Pull request #418 was closed without a merge, so I leave it out. Here is the draft:

### Release notes: kit 14.1.0

Nine changes merged since \`v14.0.0\`. Dependency bumps are left out.

**Features**

- Docked sheet keeps its width per page (#421)
- \`agentage extension up\` prints the host URL (#425)

**Fixes**

- Long names no longer clip in the status bar (#419)
- Tabs scroll the active tab into view (#426)

To update:

\`\`\`bash
npm install -g @agentage/cli@14.1.0
agentage update
\`\`\`

| Area | Changes | Pull requests |
| --- | --: | --- |
| Features | 3 | #421, #425, #427 |
| Fixes | 4 | #419, #422, #424, #426 |
| Chores | 2 | #420, #423 |
`;

export const FOLLOW_UPS = [
  'Open a pull request with these notes',
  'Shorten to five lines',
  'Add the chores list',
];

/** Context window: categories in tokens, out of a 200K window. */
export const WINDOW = 200_000;

export const CONTEXT = [
  { key: 'sys', label: 'System prompt', tokens: 4_200 },
  { key: 'tools', label: 'Tool definitions', tokens: 9_800 },
  { key: 'preset', label: 'Preset context', tokens: 12_500 },
  { key: 'conv', label: 'Conversation', tokens: 4_000 },
  { key: 'res', label: 'Tool results', tokens: 119_500 },
];

export const CONTEXT_ITEMS = [
  { name: 'Agent config', by: 'preset', tokens: '2.1K' },
  { name: 'Instructions', by: 'preset', tokens: '3.4K' },
  { name: 'Last 3 runs', by: 'preset', tokens: '7K' },
  { name: 'repos.compare', by: 'tool', tokens: '40K' },
  { name: 'repos.list_pulls', by: 'tool', tokens: '66K' },
];

export const SESSION_STEPS = [
  { at: '+0:07', name: 'memory.search', duration: '0.7 s', ok: true },
  { at: '+0:08', name: 'repos.list_tags', duration: '0.7 s', ok: true },
  { at: '+0:09', name: 'repos.compare', duration: '1.5 s', ok: true },
  { at: '+0:10', name: 'tasks.search', duration: '0.8 s', ok: true },
  { at: '+0:11', name: 'repos.list_pulls', duration: '1.7 s', ok: true },
  { at: '+0:13', name: 'repos.get_pull', duration: '0.8 s', ok: false },
  { at: '+0:26', name: 'chat.post_message', duration: '0.9 s', ok: true },
  { at: '+0:27', name: 'memory.write', duration: '0.7 s', ok: true },
];

export const TOOLS = [
  { server: 'memory', tools: ['search', 'read', 'write', 'list'], off: [] as string[] },
  {
    server: 'repos',
    tools: ['list_tags', 'compare', 'list_pulls', 'get_pull'],
    off: ['create_pull'],
  },
  { server: 'chat', tools: ['post_message', 'list_channels'], off: [] as string[] },
];

export const tokensK = (n: number): string =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 100_000 ? 0 : 1).replace(/\.0$/, '')}K` : String(n);
