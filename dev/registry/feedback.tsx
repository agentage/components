import type { CategoryEntry } from '../registry';
import { sections } from './sections';
import * as ActionBar from '../demos/action-bar';
import * as Alert from '../demos/alert';
import * as ConfirmByTyping from '../demos/confirm-by-typing';
import * as DangerZone from '../demos/danger-zone';
import * as DirtyBar from '../demos/dirty-bar';
import * as QuotaBanner from '../demos/quota-banner';
import * as Toast from '../demos/toast';

export const FEEDBACK: CategoryEntry = {
  slug: 'feedback',
  label: 'Feedback',
  description:
    'Notices about state: alerts, toasts, unsaved changes, bulk actions, destructive steps.',
  components: [
    {
      slug: 'alert',
      name: 'Alert',
      description: 'An inline notice in a tone, with a title and actions.',
      exports: ['Alert'],
      parts: [],
      demos: sections(Alert),
    },
    {
      slug: 'toast',
      name: 'Toast',
      core: true,
      description: 'A short notice that leaves on its own.',
      exports: ['ToastProvider', 'useToast'],
      parts: [],
      demos: sections(Toast),
    },
    {
      slug: 'dirty-bar',
      name: 'DirtyBar',
      core: true,
      description: 'The floating unsaved-changes bar with Discard and Save.',
      exports: ['DirtyBar'],
      parts: ['Button'],
      demos: sections(DirtyBar),
    },
    {
      slug: 'action-bar',
      name: 'ActionBar',
      core: true,
      description: 'A one-row action bar that folds actions into a menu as it narrows.',
      exports: ['ActionBar'],
      parts: ['Button', 'DropdownMenu', 'Kbd'],
      demos: sections(ActionBar),
    },
    {
      slug: 'danger-zone',
      name: 'DangerZone',
      description: 'The block of irreversible actions at the end of a settings page.',
      exports: ['DangerZone', 'DangerZoneAction'],
      parts: ['Card'],
      demos: sections(DangerZone),
    },
    {
      slug: 'confirm-by-typing',
      name: 'ConfirmByTyping',
      description: 'An AlertDialog that confirms only after the name is typed.',
      exports: ['ConfirmByTyping'],
      parts: ['AlertDialog', 'Input', 'Label'],
      demos: sections(ConfirmByTyping),
    },
    {
      slug: 'quota-banner',
      name: 'QuotaBanner',
      description: 'A banner when usage nears or passes its limit.',
      exports: ['QuotaBanner'],
      parts: ['Alert'],
      demos: sections(QuotaBanner),
    },
  ],
};
