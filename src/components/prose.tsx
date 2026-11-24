import { cn } from '../lib/utils';

export interface ProseProps extends React.HTMLAttributes<HTMLDivElement> {
  /** md: 14 px reading text (default); sm: 13 px with tighter rhythm, for panes and cards. */
  size?: 'sm' | 'md';
}

const SIZE = {
  md: 'text-sm leading-relaxed [&_p+p]:mt-4 [&_h2]:text-lg [&_h2]:mt-6 [&_h3]:text-base [&_h3]:mt-4',
  sm: 'text-ui leading-normal [&_p+p]:mt-2.5 [&_h2]:text-sm [&_h2]:mt-4 [&_h3]:text-ui [&_h3]:mt-3',
} as const;

export const Prose = ({ className, size = 'md', ...props }: ProseProps): React.JSX.Element => (
  <div
    className={cn(
      'text-muted-foreground',
      SIZE[size],
      '[&_a]:text-primary-emphasis [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-foreground [&_a]:rounded-sm [&_a]:focus-ring',
      '[&_strong]:font-semibold [&_strong]:text-foreground',
      '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mt-2',
      '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mt-2',
      '[&_li]:mt-1',
      '[&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mb-2',
      '[&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mb-1',
      '[&_code]:rounded-sm [&_code]:bg-muted [&_code]:px-1 [&_code]:py-px [&_code]:font-mono [&_code]:text-xs',
      '[&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted/40 [&_pre]:px-3 [&_pre]:py-2 [&_pre]:text-xs [&_pre]:leading-relaxed [&_pre]:text-foreground',
      '[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[length:inherit]',
      '[&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_table]:text-ui',
      '[&_th]:h-8 [&_th]:border-b [&_th]:border-border [&_th]:px-3 [&_th]:text-left [&_th]:text-xs [&_th]:font-normal',
      '[&_td]:h-9 [&_td]:border-b [&_td]:border-border [&_td]:px-3 [&_td]:text-foreground',
      '[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic',
      className
    )}
    data-slot="prose"
    data-size={size}
    {...props}
  />
);
