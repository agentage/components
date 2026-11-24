'use client';
import { Step, StepList } from '../../src';
import { Block } from '../components/demo';
import { KindIcon } from '../lib/kind-icons';

export const TimelineSteps = ({ glyphs = false }: { glyphs?: boolean }) => (
  <StepList
    glyphs={glyphs}
    footer={
      glyphs ? (
        <>
          <span>4 steps</span>
          <span>Total 44s</span>
        </>
      ) : undefined
    }
  >
    <Step offset="+0:00" icon={<KindIcon name="spark" />} label="Plan the digest" duration="2s">
      Read yesterday's merged changes and open issues, then group them by folder.
    </Step>
    <Step offset="+0:02" icon={<KindIcon name="plug" />} label="search_issues" duration="1s">
      42 results across 6 folders.
    </Step>
    <Step
      offset="+0:05"
      icon={<KindIcon name="brain" />}
      label="read notes/digest.md"
      duration="0s"
    />
    <Step
      offset="+0:41"
      icon={<KindIcon name="send" />}
      label="post #daily"
      duration="3s"
      status="error"
      defaultOpen
    >
      403 Forbidden: the bot is not a member of #daily. Invite it, then try again.
    </Step>
  </StepList>
);

export const Example = () => (
  <Block
    caption="36 px rows. Rows with a detail are buttons that expand; the error row has a red edge and the word error, not colour alone. A step with no detail is not a button."
    className="max-w-md"
  >
    <TimelineSteps />
  </Block>
);

export const Sizes = () => (
  <Block
    caption="Size md is the default (36 px, 13 px text); sm gives 28 px rows at 12 px."
    className="max-w-md space-y-3"
  >
    <StepList size="sm">
      <Step offset="+0:00" label="Open the file" duration="1s">
        Read the first page.
      </Step>
      <Step offset="+0:01" label="Parse the rows" duration="2s" />
    </StepList>
  </Block>
);

export const States = () => (
  <Block
    caption="Glyphs add a status mark per step and a footer. Up and Down move between steps."
    className="max-w-md"
  >
    <StepList
      glyphs
      footer={
        <>
          <span>5 steps</span>
          <span>Total 1m 02s</span>
        </>
      }
    >
      <Step offset="+0:00" icon={<KindIcon name="spark" />} label="Plan the digest" duration="2s">
        Group yesterday's changes by folder.
      </Step>
      <Step offset="+0:02" icon={<KindIcon name="plug" />} label="search_issues" duration="1s">
        42 results across 6 folders.
      </Step>
      <Step
        offset="+0:41"
        icon={<KindIcon name="send" />}
        label="post #daily"
        duration="3s"
        status="error"
      >
        403 Forbidden: the bot is not a member of #daily.
      </Step>
      <Step
        offset="+0:44"
        icon={<KindIcon name="brain" />}
        label="write notes/digest.md"
        status="running"
        duration="18s"
      />
      <Step offset="-" label="Post summary" status="pending" mono={false} />
    </StepList>
  </Block>
);
