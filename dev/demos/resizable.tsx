'use client';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ResizableSplit,
  useResizableSplit,
} from '../../src';
import { Block } from '../components/demo';

const Code = ({ children }: { children: string }) => (
  <code className="font-mono text-xs">{children}</code>
);

const PaneToggle = () => {
  const { collapsed, toggle } = useResizableSplit();
  return (
    <button
      type="button"
      aria-expanded={!collapsed}
      onClick={toggle}
      className="rounded border border-border px-2 py-1 text-xs"
    >
      {collapsed ? 'Show' : 'Hide'} bottom pane
    </button>
  );
};

export const Example = () => (
  <Block
    caption={
      <>
        Drag the divider, or focus it and use Arrow keys (Shift for 10%), Home and End. Sizes
        persist per browser under <Code>storageKey</Code>.
      </>
    }
  >
    <ResizablePanelGroup
      storageKey="ds-demo-browser"
      className="h-64 rounded-lg border border-border"
    >
      <ResizablePanel defaultSize={32} minSize={18} maxSize={60} className="bg-sidebar p-3">
        <p className="m-0 mb-2 text-xs font-medium text-muted-foreground">Files</p>
        <ul className="m-0 list-none space-y-1 p-0 text-ui">
          {['roadmap.md', 'architecture.md', 'meetings/standup.md', 'ideas.md'].map((f) => (
            <li key={f} className="truncate rounded px-2 py-1 hover:bg-accent">
              {f}
            </li>
          ))}
        </ul>
      </ResizablePanel>
      <ResizableHandle withGrip />
      <ResizablePanel minSize={30} className="p-4">
        <p className="m-0 mb-2 text-xs font-medium text-muted-foreground">roadmap.md</p>
        <p className="m-0 text-ui text-muted-foreground">
          The file list and this document share one container. The divider only moves the two panels
          it sits between.
        </p>
      </ResizablePanel>
    </ResizablePanelGroup>
  </Block>
);

export const Variants = () => (
  <Block caption="Vertical groups take the same API. The handle switches its orientation and cursor.">
    <ResizablePanelGroup direction="vertical" className="h-64 rounded-lg border border-border">
      <ResizablePanel defaultSize={60} minSize={25} className="p-4">
        <p className="m-0 mb-2 text-xs font-medium text-muted-foreground">Output</p>
        <p className="m-0 text-ui text-muted-foreground">Build finished without warnings.</p>
      </ResizablePanel>
      <ResizableHandle withGrip />
      <ResizablePanel minSize={20} className="bg-sidebar p-4">
        <p className="m-0 mb-2 text-xs font-medium text-muted-foreground">Log</p>
        <p className="m-0 font-mono text-xs text-muted-foreground">finished in 4.2 s</p>
      </ResizablePanel>
    </ResizablePanelGroup>
  </Block>
);

export const Sizes = () => (
  <Block
    caption={
      <>
        Pixel mode sizes the first pane in px with a min and a max. Arrow keys move 16 px, Shift 64
        px.
      </>
    }
  >
    <ResizableSplit
      storageKey="ds-demo-split-px"
      init={220}
      min={140}
      max={420}
      label="Resize sidebar"
      className="h-48 rounded-lg border border-border"
    >
      <div className="bg-sidebar p-3 text-ui">Sidebar, 140 to 420 px</div>
      <div className="p-3 text-ui text-muted-foreground">Content fills the rest.</div>
    </ResizableSplit>
  </Block>
);

export const Composition = () => (
  <Block
    caption={
      <>
        A vertical split sizes the bottom pane; <Code>collapsible</Code> adds a collapsed state.
      </>
    }
  >
    <ResizableSplit
      storageKey="ds-demo-split-bottom"
      orientation="vertical"
      collapsible
      init={96}
      min={64}
      max={200}
      label="Resize bottom pane"
      className="h-48 rounded-lg border border-border"
    >
      <div className="flex items-start justify-between p-3 text-ui">
        <span className="text-muted-foreground">Editor</span>
        <PaneToggle />
      </div>
      <div className="bg-sidebar p-3 font-mono text-xs">Bottom pane, 64 to 200 px</div>
    </ResizableSplit>
  </Block>
);
