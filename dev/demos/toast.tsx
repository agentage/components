'use client';
import { Button, useToast } from '../../src';
import { Block, Row } from '../components/demo';

export const Example = () => {
  const { toast } = useToast();
  return (
    <Block caption="A short, self-dismissing notice in the corner. Call toast() from any handler.">
      <Button
        size="sm"
        onClick={() => toast({ title: 'Saved', description: 'The report is up to date.' })}
      >
        Show toast
      </Button>
    </Block>
  );
};

export const Variants = () => {
  const { toast } = useToast();
  return (
    <Block caption="Default, success, destructive, warning and info. Each press adds a toast.">
      <Row>
        <Button
          size="sm"
          variant="outline"
          onClick={() => toast({ title: 'Default toast', description: 'Something happened.' })}
        >
          Default
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            toast({ title: 'Export done', description: 'All files are ready.', variant: 'success' })
          }
        >
          Success
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            toast({
              title: 'Export failed',
              description: 'The file could not be written.',
              variant: 'destructive',
            })
          }
        >
          Destructive
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            toast({
              title: 'Check settings',
              description: 'One value is missing.',
              variant: 'warning',
            })
          }
        >
          Warning
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            toast({ title: 'New teammate', description: 'Ada joined the team.', variant: 'info' })
          }
        >
          Info
        </Button>
      </Row>
    </Block>
  );
};
