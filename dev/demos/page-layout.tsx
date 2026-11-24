'use client';
import { PageLayout } from '../../src';
import { Block } from '../components/demo';
import { EditIcon } from '../lib/icons';

export const Example = () => (
  <Block caption="Deprecated. Compose PageHeader inside your own layout container instead.">
    <div className="h-56 overflow-hidden rounded-lg border border-border bg-background">
      <PageLayout
        title="Reports"
        subtitle="All reports for the team."
        actions={[{ title: 'Refresh', icon: <EditIcon />, onClick: () => {} }]}
      >
        <p className="text-ui text-muted-foreground">Page content goes here.</p>
      </PageLayout>
    </div>
  </Block>
);
