'use client';
import { Alert, Button } from '../../src';
import { Block } from '../components/demo';
import { UiIcon } from '../lib/ui-icons';

export const Example = () => (
  <Block caption="An inline notice with a text line and a close button.">
    <Alert className="max-w-lg" onClose={() => {}}>
      Your changes are saved as a draft.
    </Alert>
  </Block>
);

export const Variants = () => (
  <Block caption="Default, info, success, warning and destructive. An icon is optional.">
    <div className="max-w-lg space-y-2">
      <Alert onClose={() => {}}>Default: neutral information.</Alert>
      <Alert variant="info" icon={<UiIcon name="info" />} onClose={() => {}}>
        Info: with an icon and a close button.
      </Alert>
      <Alert variant="success" onClose={() => {}}>
        Success: the report was published.
      </Alert>
      <Alert variant="warning" onClose={() => {}}>
        Warning: check the settings.
      </Alert>
      <Alert variant="destructive" onClose={() => {}}>
        Error: the upload failed.
      </Alert>
    </div>
  </Block>
);

export const Composition = () => (
  <Block caption="The primary variant takes a title and a row of actions under the text. Use it for a decision the user owns.">
    <Alert
      className="max-w-lg"
      variant="primary"
      title="Needs attention"
      actions={
        <>
          <Button size="sm">Approve</Button>
          <Button size="sm" variant="outline">
            Edit first
          </Button>
        </>
      }
    >
      The release notes for version 2.1 are drafted. Publish them to the team channel?
    </Alert>
  </Block>
);
