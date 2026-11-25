const Svg = ({ d }: { d: string }) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    className="fill-none stroke-current stroke-[1.75]"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

export const ListToolbarIcons = {
  filter: <Svg d="M4 5h16l-6 7.5V19l-4-2v-4.5z" />,
  display: <Svg d="M4 7h10M18 7h2M4 17h4M12 17h8M14 5v4M8 15v4" />,
  list: <Svg d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />,
  cards: <Svg d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  board: <Svg d="M4 4h4v16H4zM10 4h4v10h-4zM16 4h4v13h-4z" />,
  search: <Svg d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4" />,
  more: (
    <Svg d="M4 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0M11 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0M18 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0" />
  ),
};
