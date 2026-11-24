'use client';
import { useRef, useState } from 'react';
import {
  ActionBar,
  ActiveFilters,
  applyListControls,
  FilterMenu,
  InspectorPanel,
  List,
  ListToolbar,
  ListToolbarEnd,
  ResizableSplit,
  ToolbarSearch,
  ToolbarToggle,
  useAnnounce,
  useListControls,
  type ListApplyConfig,
  type ListFilterGroup,
} from '../../../src';
import { Block } from '../../components/demo';
import {
  GROUP_OF,
  KIND_LABEL,
  REQUESTS,
  type RequestItem,
  type RequestKind,
} from '../../lib/requests-data';
import {
  actionsOf,
  assignMenu,
  kindIcon,
  ReadingPane,
  RequestDetails,
  tailOf,
  toListItem,
} from '../../lib/requests-parts';

const CONFIG: ListApplyConfig<RequestItem> = {
  search: (it) => `${it.title} ${it.summary} ${it.sender}`,
  filters: { kind: (it) => it.kind },
  flags: { unread: (it) => it.unread },
};

const KINDS = Object.keys(KIND_LABEL) as RequestKind[];

/** Kind filter with counts of the rows that pass the search and the Unread toggle. */
const kindFilter = (items: RequestItem[], query: string, unread: boolean): ListFilterGroup[] => {
  const q = query.toLowerCase();
  const kept = items.filter(
    (it) => (!unread || it.unread) && (CONFIG.search?.(it).toLowerCase().includes(q) ?? true)
  );
  return [
    {
      id: 'kind',
      label: 'Kind',
      options: KINDS.map((k) => ({
        value: k,
        label: KIND_LABEL[k],
        icon: kindIcon(k),
        count: kept.filter((it) => it.kind === k).length,
      })),
    },
  ];
};

const useRequests = () => {
  const [items, setItems] = useState(REQUESTS);
  const [selected, setSelected] = useState<string>(REQUESTS[0].id);
  const [details, setDetails] = useState(false);
  const c = useListControls();
  const announce = useAnnounce();
  const shown = applyListControls(items, c.state, CONFIG).rows;
  const current = items.find((it) => it.id === selected) ?? shown[0] ?? items[0];
  const act = (label: string): void => {
    if (label === 'Details') return setDetails((d) => !d);
    if (label === 'Snooze' || label.startsWith('Mark')) {
      setItems((l) =>
        l.map((it) => (it.id === current.id ? { ...it, unread: label === 'Mark unread' } : it))
      );
      return announce(`${label}: ${current.title}`);
    }
    const next = shown[shown.indexOf(current) + 1] ?? shown[shown.indexOf(current) - 1];
    setItems((l) => l.filter((it) => it.id !== current.id));
    if (next) setSelected(next.id);
    announce(`${label}: ${current.title}`);
  };
  return { items, shown, current, select: setSelected, details, setDetails, c, act };
};

export const Example = () => {
  const s = useRequests();
  const box = useRef<HTMLDivElement>(null);
  const { state } = s.c;
  const unread = state.flags.unread ?? false;
  const filters = kindFilter(s.items, state.query, unread);
  return (
    <Block caption="Pick an item on the left and the reading pane swaps beside it. J and K move.">
      <div
        ref={box}
        className="flex h-[640px] overflow-hidden rounded-lg border border-border bg-background"
      >
        <div className="min-w-0 flex-1">
          <ResizableSplit
            storageKey="ds-docs-requests-split"
            init={380}
            min={300}
            max={520}
            label="Resize the list"
          >
            <div className="flex h-full min-h-0 flex-col">
              <ListToolbar aria-label="Request controls" className="px-2.5">
                <ToolbarSearch
                  value={state.query}
                  onValueChange={s.c.setQuery}
                  placeholder="Search requests"
                />
                <FilterMenu
                  groups={filters}
                  value={state.filters}
                  onToggle={s.c.toggleFilter}
                  onClear={s.c.clearFilters}
                />
                <ActiveFilters groups={filters} value={state.filters} onRemove={s.c.toggleFilter} />
                <ListToolbarEnd>
                  <ToolbarToggle
                    pressed={unread}
                    onPressedChange={(on) => s.c.setFlag('unread', on)}
                  >
                    Unread
                  </ToolbarToggle>
                </ListToolbarEnd>
              </ListToolbar>
              <List
                label="Requests"
                variant="stacked"
                className="min-h-0 flex-1 overflow-auto"
                items={s.shown.map(toListItem)}
                groupBy={(m) => GROUP_OF[m.item.kind]}
                groupOrder={['wait', 'review', 'info']}
                storageKey="ds-docs-requests-groups"
                value={s.current.id}
                onValueChange={s.select}
                onOpen={(id) => {
                  s.select(id);
                  document.getElementById('request-title')?.closest('article')?.focus();
                }}
              />
            </div>
            <div className="flex h-full min-h-0 flex-col">
              <div className="min-h-0 flex-1 overflow-auto">
                <ReadingPane it={s.current} />
              </div>
              <ActionBar
                aria-label="Request actions"
                hotkeys
                hotkeyScope={box}
                actions={actionsOf(s.current, s.act)}
                menu={assignMenu(s.act)}
                tail={tailOf(s.current, s.act)}
              />
            </div>
          </ResizableSplit>
        </div>
        <InspectorPanel
          open={s.details}
          onOpenChange={s.setDetails}
          title="Details"
          storageKey="ds-docs-requests-inspector"
        >
          <RequestDetails it={s.current} />
        </InspectorPanel>
      </div>
    </Block>
  );
};
