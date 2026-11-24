'use client';
import { Button, QuotaBanner } from '../../src';
import { Block } from '../components/demo';
import { UiIcon } from '../lib/ui-icons';

export const Example = () => (
  <Block caption="A banner at the warning level: usage is at 82 percent, so it offers an upgrade.">
    <QuotaBanner
      className="max-w-lg"
      label="storage"
      value={82}
      max={100}
      icon={<UiIcon name="info" />}
      action={
        <Button size="sm" variant="outline">
          Upgrade
        </Button>
      }
    />
  </Block>
);

export const States = () => (
  <div className="max-w-lg space-y-5">
    <Block caption="Critical: usage is at 98 percent, so the banner turns destructive.">
      <QuotaBanner
        label="API calls"
        value={9_800}
        max={10_000}
        action={
          <Button size="sm" variant="outline">
            Buy credits
          </Button>
        }
      />
    </Block>
    <Block caption="Over the limit: usage is above 100 percent and the text says the limit is reached.">
      <QuotaBanner label="seats" value={520} max={500} />
    </Block>
    <Block caption="Below the warning threshold the banner renders nothing, so it can stay in the page.">
      <QuotaBanner label="storage" value={20} max={100} />
      <p className="m-0 text-xs text-muted-foreground">Nothing is shown above this line.</p>
    </Block>
  </div>
);
