import { cva } from 'class-variance-authority';

export const descriptionListVariants = cva('m-0 grid gap-x-3 gap-y-2.5', {
  variants: {
    /** `editable`: rows of Property editors, centred on their 24 px value buttons. */
    variant: {
      default: '',
      editable: 'items-center gap-y-1.5',
    },
    labelWidth: {
      sm: '',
      md: '',
      auto: '',
    },
    /** `responsive`: one pair per row, two pairs once the container is 520 px or wider. */
    columns: {
      1: '',
      2: 'gap-x-4',
      responsive: '@min-[520px]:gap-x-4',
    },
    /** `sm` (default) is the dense 13 px text; `md` is the 14 px body size. */
    size: {
      sm: 'text-ui',
      md: 'text-sm',
    },
  },
  compoundVariants: [
    { columns: [1, 'responsive'], labelWidth: 'sm', class: 'grid-cols-[90px_minmax(0,1fr)]' },
    { columns: [1, 'responsive'], labelWidth: 'md', class: 'grid-cols-[110px_minmax(0,1fr)]' },
    { columns: [1, 'responsive'], labelWidth: 'auto', class: 'grid-cols-[auto_minmax(0,1fr)]' },
    {
      columns: 2,
      labelWidth: 'sm',
      class: 'grid-cols-[90px_minmax(0,1fr)_90px_minmax(0,1fr)]',
    },
    {
      columns: 2,
      labelWidth: 'md',
      class: 'grid-cols-[110px_minmax(0,1fr)_110px_minmax(0,1fr)]',
    },
    {
      columns: 2,
      labelWidth: 'auto',
      class: 'grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)]',
    },
    {
      columns: 'responsive',
      labelWidth: 'sm',
      class: '@min-[520px]:grid-cols-[90px_minmax(0,1fr)_90px_minmax(0,1fr)]',
    },
    {
      columns: 'responsive',
      labelWidth: 'md',
      class: '@min-[520px]:grid-cols-[110px_minmax(0,1fr)_110px_minmax(0,1fr)]',
    },
    {
      columns: 'responsive',
      labelWidth: 'auto',
      class: '@min-[520px]:grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)]',
    },
  ],
  defaultVariants: { variant: 'default', labelWidth: 'sm', columns: 1, size: 'sm' },
});
