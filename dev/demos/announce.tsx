'use client';
import { Button, useAnnounce } from '../../src';
import { Block } from '../components/demo';

export const Example = () => {
  const announce = useAnnounce();
  return (
    <Block caption="Cards and forms announce their state changes with this hook. It writes to one hidden live region; try it with a screen reader on.">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          announce('Save failed: the server is offline', 'assertive');
        }}
      >
        Announce an assertive error
      </Button>
    </Block>
  );
};
