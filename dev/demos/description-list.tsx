'use client';
import { DescriptionDetail, DescriptionGroup, DescriptionList, DescriptionTerm } from '../../src';
import { Block } from '../components/demo';
import { KindIcon } from '../lib/kind-icons';
import { Editable } from './description-list.editable';

const BOX = 'rounded-lg border border-border p-4';
const BRANCH = 'release/2026-11-22-a-very-long-generated-branch-name';

export const Example = () => (
  <Block
    caption="Term and detail pairs in a dense 13 px grid with a 90 px label column."
    className={`${BOX} max-w-sm`}
  >
    <DescriptionList>
      <DescriptionTerm>Owner</DescriptionTerm>
      <DescriptionDetail>Ada Lovelace</DescriptionDetail>
      <DescriptionTerm>Created</DescriptionTerm>
      <DescriptionDetail>22 Nov 2026, 09:00</DescriptionDetail>
      <DescriptionTerm>Status</DescriptionTerm>
      <DescriptionDetail>Active</DescriptionDetail>
    </DescriptionList>
  </Block>
);

export const Variants = () => (
  <div className="space-y-5">
    <Block
      caption="Label width md widens the label column to 110 px; auto fits the longest term."
      className={`${BOX} max-w-sm`}
    >
      <DescriptionList labelWidth="md">
        <DescriptionTerm>Work folder</DescriptionTerm>
        <DescriptionDetail>Shared</DescriptionDetail>
        <DescriptionTerm>Size</DescriptionTerm>
        <DescriptionDetail>2.4 MB</DescriptionDetail>
      </DescriptionList>
    </Block>
    <Block
      caption="Responsive columns show one pair per row, and two once the box is 520 px wide."
      className={`${BOX} max-w-2xl`}
    >
      <DescriptionList columns="responsive" labelWidth="md">
        <DescriptionTerm>Schedule</DescriptionTerm>
        <DescriptionDetail>Every day 09:00</DescriptionDetail>
        <DescriptionTerm>Next</DescriptionTerm>
        <DescriptionDetail>in 21 h</DescriptionDetail>
        <DescriptionTerm>Owner</DescriptionTerm>
        <DescriptionDetail>Grace Hopper</DescriptionDetail>
        <DescriptionTerm>Success</DescriptionTerm>
        <DescriptionDetail>27 of 30</DescriptionDetail>
      </DescriptionList>
    </Block>
  </div>
);

export const States = () => (
  <div className="space-y-5">
    <Block
      caption="Mono keeps a path on one font; without truncate, a long value wraps."
      className={`${BOX} max-w-sm`}
    >
      <DescriptionList>
        <DescriptionTerm>Branch</DescriptionTerm>
        <DescriptionDetail mono>{BRANCH}</DescriptionDetail>
      </DescriptionList>
    </Block>
    <Block
      caption="Truncate keeps one line, with the full text in a title; copy adds a hover button."
      className={`${BOX} max-w-sm`}
    >
      <DescriptionList>
        <DescriptionTerm>Branch</DescriptionTerm>
        <DescriptionDetail mono copy truncate>
          {BRANCH}
        </DescriptionDetail>
      </DescriptionList>
    </Block>
  </div>
);

const Groups = () => (
  <Block
    caption="Groups with a small heading, term icons, copy buttons and links."
    className={`${BOX} max-w-md space-y-4`}
  >
    <DescriptionGroup title="Record">
      <DescriptionList labelWidth="md">
        <DescriptionTerm icon={<KindIcon name="activity" />}>Record</DescriptionTerm>
        <DescriptionDetail mono copy truncate>
          rec_8f2a91c4e7b04d1a
        </DescriptionDetail>
        <DescriptionTerm icon={<KindIcon name="file" />}>Report</DescriptionTerm>
        <DescriptionDetail href="#report">Quarterly report</DescriptionDetail>
        <DescriptionTerm icon={<KindIcon name="clock" />}>Created</DescriptionTerm>
        <DescriptionDetail>22 Nov 2026, 09:00</DescriptionDetail>
      </DescriptionList>
    </DescriptionGroup>
    <DescriptionGroup title="Storage">
      <DescriptionList labelWidth="md">
        <DescriptionTerm icon={<KindIcon name="folder" />}>Folder</DescriptionTerm>
        <DescriptionDetail mono copy truncate>
          /shared/reports/2026-11-22/final
        </DescriptionDetail>
      </DescriptionList>
    </DescriptionGroup>
  </Block>
);

export const Composition = () => (
  <div className="space-y-5">
    <Groups />
    <Editable />
  </div>
);
