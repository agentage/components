// The public surface, one block per docs category. A module re-exported here gets its own
// subpath (`npm run exports:generate`); everything else is internal.

// Foundations: buttons, glyphs, text, loading and copy.

export { Avatar } from './avatar';
export type { AvatarProps, AvatarSize } from './avatar';
export { Badge } from './badge';
export type { BadgeProps } from './badge';
export { Button, buttonVariants } from './button';
export type { ButtonProps, ButtonSize } from './button';
export { Chip } from './chip';
export type { ChipProps } from './chip';
export { CopyButton } from './copy-button';
export type { CopyButtonProps } from './copy-button';
export { IconButton } from './icon-button';
export type { IconButtonProps } from './icon-button';
export { Kbd } from './kbd';
export type { KbdProps } from './kbd';
export { PRIORITY_LABEL, PriorityGlyph } from './priority-glyph';
export type { Priority, PriorityGlyphProps } from './priority-glyph';
export { Prose } from './prose';
export type { ProseProps } from './prose';
export { Skeleton } from './skeleton';
export type { SkeletonProps } from './skeleton';
export { Spinner } from './spinner';
export type { SpinnerProps } from './spinner';
export { StatusGlyph } from './status-glyph';
export type { StatusGlyphProps, StatusGlyphShape } from './status-glyph';
export { announce, useAnnounce } from '../lib/use-announce';
export type { AnnouncePoliteness } from '../lib/use-announce';
export { activeSection, useScrollSpy } from '../lib/use-scroll-spy';
export type { ScrollSpyOptions } from '../lib/use-scroll-spy';

// Forms: fields, pickers, toggles and form layout.

export { Checkbox } from './checkbox';
export type { CheckboxProps } from './checkbox';
export { DatePicker, parseRelativeRange, resolveDateRange } from './date-picker';
export type { DatePickerProps, DatePickerRangeProps, DateRange } from './date-picker';
export { FormField } from './form-field';
export type { FormFieldProps } from './form-field';
export { InlineEdit } from './inline-edit';
export type { InlineEditProps } from './inline-edit';
export { Input, Textarea } from './input';
export type { InputProps, TextareaProps } from './input';
export { Label } from './label';
export type { LabelProps } from './label';
export { RadioGroup, RadioGroupItem } from './radio-group';
export type { RadioGroupItemProps, RadioGroupProps } from './radio-group';
export { SecretInput } from './secret-input';
export type { SecretInputProps } from './secret-input';
export { Section, SectionLabel } from './section';
export type { SectionLabelProps, SectionProps } from './section';
export { Select } from './select';
export type { SelectOption, SelectProps } from './select';
export { Switch } from './switch';
export type { SwitchProps } from './switch';
export { ToggleButton, ToggleGroup } from './toggle-group';
export type {
  ToggleButtonProps,
  ToggleGroupColumns,
  ToggleGroupProps,
  ToggleOption,
} from './toggle-group';
export { TreeSelect } from './tree-select';
export type { TreeSelectLabels, TreeSelectNode, TreeSelectProps } from './tree-select';
export { describeCron } from '../lib/cron';
export type { CronDescription } from '../lib/cron';

// Navigation: trees, tabs, paths and page headers.

export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';
export type { BreadcrumbProps } from './breadcrumb';
export { NavRow, NavTree } from './nav-tree';
export type { NavRowProps, NavTreeProps } from './nav-tree';
export { MetaItem, PageHeader } from './page-header';
export type { MetaItemProps, PageHeaderAction, PageHeaderProps } from './page-header';
export { Pagination } from './pagination';
export type { PaginationProps } from './pagination';
export { SectionIndex } from './section-index';
export type { SectionIndexProps, SectionIndexSection } from './section-index';
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from './sidebar';
export type { SidebarContentProps, SidebarProps } from './sidebar';
export { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
export type {
  TabsContentProps,
  TabsListProps,
  TabsProps,
  TabsTriggerProps,
  TabsVariant,
} from './tabs';

// Lists and data: rows, tables, the DataView, its toolbar, logs and data trees.

export { DataTree } from './data-tree';
export type { DataKind, DataTreeProps } from './data-tree';
export { DataView } from './data-view';
export type {
  DataViewActions,
  DataViewColumn,
  DataViewDefault,
  DataViewKind,
  DataViewProps,
  DataViewState,
  DataViewValue,
} from './data-view';
export { Disclosure } from './disclosure';
export type { DisclosureProps } from './disclosure';
export { List, ListRow } from './entity-list';
export type { ListItem, ListProps, ListRowProps, ListRowVariant } from './entity-list';
export { GroupHeader } from './group-header';
export type { GroupHeaderProps } from './group-header';
export {
  ActiveFilters,
  DisplayMenu,
  FilterMenu,
  ListToolbar,
  ListToolbarEnd,
  ToolbarSearch,
  ToolbarToggle,
  ViewSwitch,
} from './list-toolbar';
export type {
  ActiveFiltersProps,
  DisplayMenuProps,
  DisplayOption,
  FilterMenuProps,
  ListFilterGroup,
  ListFilterOption,
  ListToolbarProps,
  ToolbarSearchProps,
  ToolbarToggleProps,
  ViewSwitchOption,
  ViewSwitchProps,
} from './list-toolbar';
export { LogView } from './log-view';
export type { LogLevel, LogLine, LogViewProps } from './log-view';
export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
export type { TableHeadProps, TableProps } from './table';
export { Truncate } from './truncate';
export type { TruncateProps } from './truncate';
export { activeFilterCount, applyListControls, EMPTY_LIST_CONTROLS } from '../lib/list-controls';
export { useListControls } from '../lib/use-list-controls';
export type {
  ListApplyConfig,
  ListApplyResult,
  ListControls,
  ListControlsOptions,
  ListControlsState,
  ListGroup,
  ListSort,
} from '../lib/use-list-controls';
export type { DragGroup, DragMove, DragReorderOptions, DropTarget } from '../lib/use-drag-reorder';

// Display: cards, facts, meters, status, disclosure and content blocks.

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';
export type {
  AccordionContentProps,
  AccordionItemProps,
  AccordionProps,
  AccordionTriggerProps,
} from './accordion';
export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMeta,
  CardTitle,
} from './card';
export type {
  CardError,
  CardFallback,
  CardMetaProps,
  CardProps,
  CardRootProps,
  CardState,
} from './card';
export { CheckItem, CheckList } from './check-list';
export type { CheckItemProps, CheckListProps, CheckStatus } from './check-list';
export { CodeBlock, InlineCode } from './code-block';
export type { CodeBlockProps, InlineCodeProps } from './code-block';
export { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';
export type {
  CollapsibleContentProps,
  CollapsibleProps,
  CollapsibleTriggerProps,
} from './collapsible';
export { ContentBlocks } from './content-blocks';
export type {
  BlockStep,
  BlockStepState,
  ContentBlockData,
  ContentBlocksProps,
  DiffFile,
  DiffHunk,
} from './content-blocks';
export type { ContentBlockSource } from './content-block';
export {
  DescriptionDetail,
  DescriptionGroup,
  DescriptionList,
  DescriptionTerm,
} from './description-list';
export type {
  DescriptionDetailProps,
  DescriptionGroupProps,
  DescriptionListProps,
  DescriptionTermProps,
} from './description-list';
export { Property, PropertyText, PropertyValue } from './description-list.property';
export type {
  PropertyProps,
  PropertyTextProps,
  PropertyValueProps,
} from './description-list.property';
export { PropertyDate } from './property-date';
export type { PropertyDateProps } from './property-date';
export { formatPropertyDate } from './property-date.format';
export { PropertyMultiSelect, PropertySelect } from './property-select';
export type {
  PropertyMultiSelectProps,
  PropertyOption,
  PropertySelectProps,
} from './property-select';
export { EmptyState } from './empty-state';
export type { EmptyStateProps } from './empty-state';
export { Progress } from './progress';
export type { ProgressProps, ProgressSegment, ProgressSegmentTone } from './progress';
export { RelativeTime } from './relative-time';
export type { RelativeTimeProps, RelativeTimeValue } from './relative-time';
export { formatRelativeTime } from '../lib/relative-time-format';
export { MiniBars, Sparkline } from './sparkline';
export type { MiniBarsProps, MiniBarsTone, SparklineProps } from './sparkline';
export { StatCard } from './stat-card';
export type { StatCardProps, StatCardSentiment, StatCardTrend } from './stat-card';
export { StatusBar } from './status-bar';
export type { StatusBarCell, StatusBarProps, StatusBarTone } from './status-bar';
export { Step, StepList } from './step-list';
export type { StepListProps, StepProps, StepStatus } from './step-list';

// Overlays: dialogs, sheets, popovers, menus and split panes.

export { Command, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from './command';
export type { CommandGroupProps, CommandItemProps, CommandProps } from './command';
export { Dialog, DialogFooter } from './dialog';
export type { DialogFooterProps, DialogProps } from './dialog';
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from './dropdown-menu';
export type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuItemProps,
  DropdownMenuLabelProps,
  DropdownMenuProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuSeparatorProps,
} from './dropdown-menu';
export { Popover } from './popover';
export type { PopoverProps } from './popover';
export { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './resizable';
export type {
  ResizableHandleProps,
  ResizablePanelGroupProps,
  ResizablePanelProps,
  ResizeDirection,
} from './resizable';
export {
  ResizableSplit,
  resizableSplitCollapsedVar,
  resizableSplitVar,
  useResizableSplit,
} from './resizable-split';
export type { ResizableSplitApi, ResizableSplitProps } from './resizable-split';
export { ResizableSplitPrepaint, resizableSplitPrepaint } from './resizable-split-prepaint';
export type { ResizableSplitPrepaintProps } from './resizable-split-prepaint';
export { Sheet } from './sheet';
export type { SheetProps } from './sheet';
export { Tooltip } from './tooltip';
export type { TooltipProps } from './tooltip';

// Feedback: alerts, toasts and action bars.

export { ActionBar } from './action-bar';
export type { ActionBarAction, ActionBarMenu, ActionBarProps } from './action-bar';
export { Alert } from './alert';
export type { AlertProps } from './alert';
export { DirtyBar } from './dirty-bar';
export type { DirtyBarLabels, DirtyBarProps } from './dirty-bar';
export { ToastProvider, useToast } from './toast';

// Chat: the conversation, messages, markdown answers, tool calls and the composer.

export { ApprovalBar } from './approval-bar';
export type { ApprovalBarProps, ApprovalDecision } from './approval-bar';
export { ContextMeter, meterTone } from './context-meter';
export type { ContextMeterProps } from './context-meter';
export { Conversation } from './conversation';
export type { ConversationProps } from './conversation';
export { Markdown } from './markdown';
export type { MarkdownProps } from './markdown';
export { Message } from './message';
export type { MessageProps } from './message';
export { PromptInput } from './prompt-input';
export type { PromptInputProps } from './prompt-input';
export { Reasoning } from './reasoning';
export type { ReasoningProps } from './reasoning';
export { ToolCall } from './tool-call';
export type { ToolCallProps, ToolCallStatus } from './tool-call';
export { ToolGroup } from './tool-group';
export type { ToolGroupProps } from './tool-group';
