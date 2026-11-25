'use client';
import { useState } from 'react';
import { IconButton, Tooltip } from '../../src';
import { Block, Row } from '../components/demo';
import { BotIcon, EditIcon, InfoIcon, ServerIcon } from '../lib/icons';

export const Example = () => (
  <Block caption="An icon-only control needs a title or aria-label; the title also shows as the native tooltip.">
    <Row>
      <IconButton icon={<EditIcon />} title="Edit" onClick={() => {}} />
    </Row>
  </Block>
);

export const Sizes = () => (
  <Block caption="Size sm is 24 px with a 14 px icon; md is 28 px with a 16 px icon.">
    <Row className="gap-3">
      <IconButton size="sm" icon={<EditIcon />} title="Edit small" onClick={() => {}} />
      <IconButton size="md" icon={<EditIcon />} title="Edit medium" onClick={() => {}} />
    </Row>
  </Block>
);

export const States = () => {
  const [view, setView] = useState<'list' | 'grid'>('list');
  return (
    <div className="space-y-5">
      <Block caption="Pressed keeps the accent surface on, for toggles such as a view switch.">
        <Row className="gap-1">
          <IconButton
            icon={<ServerIcon />}
            title="List view"
            pressed={view === 'list'}
            onClick={() => {
              setView('list');
            }}
          />
          <IconButton
            icon={<BotIcon />}
            title="Card view"
            pressed={view === 'grid'}
            onClick={() => {
              setView('grid');
            }}
          />
        </Row>
      </Block>
      <Block caption="Disabled drops to half opacity and shows the not-allowed cursor.">
        <Row className="gap-1">
          <IconButton icon={<EditIcon />} title="Edit" disabled onClick={() => {}} />
          <IconButton icon={<InfoIcon />} title="Info" disabled onClick={() => {}} />
        </Row>
      </Block>
    </div>
  );
};

export const Composition = () => (
  <Block caption="Wrap an icon button in a Tooltip when the action needs a visible name on hover.">
    <Row className="gap-1">
      <Tooltip content="Edit">
        <span className="cursor-default">
          <IconButton icon={<EditIcon />} title="Edit" size="sm" onClick={() => {}} />
        </span>
      </Tooltip>
      <Tooltip content="Info">
        <span className="cursor-default">
          <IconButton icon={<InfoIcon />} title="Info" size="sm" onClick={() => {}} />
        </span>
      </Tooltip>
    </Row>
  </Block>
);
