'use client';
import { Avatar, IconContainer, StatusGlyph } from '../../src';
import { Block, Row } from '../components/demo';
import { BotIcon, EditIcon, HeartIcon, InfoIcon, ServerIcon } from '../lib/icons';

/** Avatar with a state mark on its lower-right edge, cut out of the page background. */
const WithMark = ({ name, children }: { name: string; children: React.ReactNode }) => (
  <span className="relative inline-flex">
    <Avatar name={name} />
    <span className="absolute -right-1 -bottom-1 grid place-items-center rounded-full bg-background p-px">
      {children}
    </span>
  </span>
);

export const Example = () => (
  <Block caption="An avatar shows initials from a name; the default size is sm 28 px.">
    <Row className="gap-3">
      <Avatar name="Ada Lovelace" />
      <Avatar name="Grace Hopper" tone="primary" />
    </Row>
  </Block>
);

export const Variants = () => (
  <div className="space-y-5">
    <Block caption="Tone muted is the quiet disc; tone primary is the accent disc with bold initials.">
      <Row className="gap-3">
        <Avatar name="Ada Lovelace" />
        <Avatar name="Grace Hopper" tone="primary" />
      </Row>
    </Block>
    <Block caption="A square avatar with an icon stands for a team, a service or any non-person.">
      <Row className="gap-3">
        <Avatar shape="square" icon={<ServerIcon />} name="Backup service" />
        <Avatar shape="square" icon={<BotIcon />} name="Support team" size="md" />
        <Avatar shape="square" icon={<HeartIcon />} name="Favorites" size="lg" tone="primary" />
      </Row>
    </Block>
    <Block caption="IconContainer is a tinted square for a glyph: sm 24, md 28 (default), lg 32 and xl 40 px.">
      <Row>
        <IconContainer tone="blue" size="sm">
          <InfoIcon />
        </IconContainer>
        <IconContainer tone="green">
          <EditIcon />
        </IconContainer>
        <IconContainer tone="amber">
          <HeartIcon />
        </IconContainer>
        <IconContainer tone="violet" size="lg">
          <BotIcon />
        </IconContainer>
        <IconContainer tone="rose" size="lg">
          <HeartIcon />
        </IconContainer>
        <IconContainer tone="cyan" size="xl">
          <ServerIcon />
        </IconContainer>
      </Row>
    </Block>
  </div>
);

export const Sizes = () => (
  <Block caption="From 2xs 18 px for inline meta up to 2xl 80 px for profiles; sm is the default.">
    <div className="flex items-end gap-3">
      <Avatar name="Ada Lovelace" size="2xs" />
      <Avatar name="Ada Lovelace" size="xs" />
      <Avatar name="Ada Lovelace" />
      <Avatar name="Ada Lovelace" size="md" />
      <Avatar name="Ada Lovelace" size="lg" />
      <Avatar name="Ada Lovelace" size="xl" />
      <Avatar name="Ada Lovelace" size="2xl" />
    </div>
  </Block>
);

export const States = () => (
  <div className="space-y-5">
    <Block caption="Without a name the avatar shows a question mark.">
      <Row className="gap-3">
        <Avatar />
        <Avatar size="md" />
      </Row>
    </Block>
    <Block caption="A broken image URL falls back to the initials.">
      <Row className="gap-3">
        <Avatar name="Grace Hopper" src="/missing-avatar.png" size="md" />
        <Avatar name="Ada Lovelace" src="/missing-avatar.png" />
      </Row>
    </Block>
  </div>
);

export const Composition = () => (
  <Block caption="A StatusGlyph on the lower-right edge marks a live state: active, waiting or failed.">
    <Row className="gap-4">
      <WithMark name="Nightly backup">
        <StatusGlyph shape="disc" tone="primary" pulse label="In progress" />
      </WithMark>
      <WithMark name="Weekly digest">
        <StatusGlyph shape="question" tone="primary" label="Needs input" />
      </WithMark>
      <WithMark name="Release notes">
        <StatusGlyph shape="cross" tone="destructive" label="Failed" />
      </WithMark>
    </Row>
  </Block>
);
