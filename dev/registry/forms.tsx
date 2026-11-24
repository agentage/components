import type { CategoryEntry } from '../registry';
import { sections } from './sections';
import * as Checkbox from '../demos/checkbox';
import * as Combobox from '../demos/combobox';
import * as DatePicker from '../demos/date-picker';
import * as FormField from '../demos/form-field';
import * as InlineEdit from '../demos/inline-edit';
import * as Input from '../demos/input';
import * as SecretInput from '../demos/secret-input';
import * as RadioGroup from '../demos/radio-group';
import * as Section from '../demos/section';
import * as Select from '../demos/select';
import * as Slider from '../demos/slider';
import * as ToggleGroup from '../demos/toggle-group';
import * as TreeSelect from '../demos/tree-select';

export const FORMS: CategoryEntry = {
  slug: 'forms',
  label: 'Forms',
  description: 'Inputs, pickers and the layouts that label them.',
  components: [
    {
      slug: 'input',
      name: 'Input and Textarea',
      core: true,
      description: 'Text fields: md 30 px, sm 26 px at 12 px, mono and auto-grow options.',
      exports: ['Input', 'Textarea'],
      parts: ['fieldVariants'],
      demos: sections(Input),
    },
    {
      slug: 'secret-input',
      name: 'SecretInput',
      description: 'Write-only key field: masked, reveal while unsaved, set-only once stored.',
      exports: ['SecretInput'],
      parts: ['Input', 'IconButton', 'fieldVariants'],
      demos: sections(SecretInput),
    },
    {
      slug: 'select',
      name: 'Select',
      description: 'A native-feeling single choice from a short list.',
      exports: [
        'Select',
        'SelectTrigger',
        'SelectContent',
        'SelectItem',
        'SelectValue',
        'SelectGroup',
        'SelectLabel',
        'SelectSeparator',
      ],
      parts: ['fieldVariants'],
      demos: sections(Select),
    },
    {
      slug: 'combobox',
      name: 'Combobox',
      description: 'A searchable single choice in an anchored list.',
      exports: ['Combobox'],
      parts: ['fieldVariants'],
      demos: sections(Combobox),
    },
    {
      slug: 'tree-select',
      name: 'TreeSelect',
      description: 'A popover picker over a searchable tree, single or multiple.',
      exports: ['TreeSelect'],
      parts: ['NavRow', 'fieldVariants', 'Truncate'],
      demos: sections(TreeSelect),
    },
    {
      slug: 'date-picker',
      name: 'DatePicker',
      description: 'A day field, or a range with presets and relative input such as 6h.',
      exports: ['DatePicker'],
      parts: ['fieldVariants'],
      demos: sections(DatePicker),
    },
    {
      slug: 'checkbox-and-switch',
      name: 'Checkbox and Switch',
      description: 'Binary controls, each in md and sm.',
      exports: ['Checkbox', 'Switch'],
      parts: [],
      demos: sections(Checkbox),
    },
    {
      slug: 'radio-group',
      name: 'RadioGroup',
      description: 'One choice from a short visible list.',
      exports: ['RadioGroup', 'RadioGroupItem'],
      parts: [],
      demos: sections(RadioGroup),
    },
    {
      slug: 'slider',
      name: 'Slider',
      description: 'A value or range on a track, keyboard adjustable.',
      exports: ['Slider'],
      parts: [],
      demos: sections(Slider),
    },
    {
      slug: 'toggle-group',
      name: 'ToggleGroup',
      description: 'A radio group of buttons, as a grid or a joined segmented control.',
      exports: ['ToggleGroup', 'ToggleButton'],
      parts: [],
      demos: sections(ToggleGroup),
    },
    {
      slug: 'form-field',
      name: 'FormField',
      core: true,
      description: 'Label, hint, error and a live preview around one control, stacked or in a row.',
      exports: ['FormField'],
      parts: [],
      demos: sections(FormField),
    },
    {
      slug: 'section',
      name: 'Section',
      description: 'A settings section: label column, body and an optional collapse.',
      exports: ['Section', 'SectionLabel'],
      parts: [],
      demos: sections(Section),
    },
    {
      slug: 'inline-edit',
      name: 'InlineEdit',
      description: 'Text that turns into a field in place; read and edit share one box.',
      exports: ['InlineEdit'],
      parts: [],
      demos: sections(InlineEdit),
    },
  ],
};
