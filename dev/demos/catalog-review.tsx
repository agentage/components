'use client';
import {
  CatalogList,
  LimitsView,
  NotesView,
  SuggestionsView,
} from '../components/catalog-review-view';

import {
  SUGGEST_ADD,
  SUGGEST_REMOVE,
  SUGGEST_UPDATE,
  SUGGEST_RESTRUCTURE,
} from './catalog-review.suggest';
import {
  NOTES_LOOK,
  NOTES_NEW,
  NOTES_NEW_PROPS,
  NOTES_RENAMED,
  NOTES_DEPRECATED,
  NOTES_BEHAVIOUR,
  KNOWN_LIMITS,
} from './catalog-review.notes';

export const Catalog = () => <CatalogList />;

export const Suggestions = () => (
  <SuggestionsView
    parts={[
      { label: 'Add', context: 'Screen that needs it', rows: SUGGEST_ADD },
      { label: 'Remove', context: 'What would break', rows: SUGGEST_REMOVE },
      { label: 'Update', rows: SUGGEST_UPDATE },
      { label: 'Restructure', rows: SUGGEST_RESTRUCTURE },
    ]}
  />
);

export const ReleaseNotes = () => (
  <NotesView
    groups={[
      { label: 'Look changes', rows: NOTES_LOOK },
      { label: 'New', rows: NOTES_NEW },
      { label: 'New props', rows: NOTES_NEW_PROPS },
      { label: 'Renamed with alias', rows: NOTES_RENAMED },
      { label: 'Deprecated', rows: NOTES_DEPRECATED },
      { label: 'Behaviour changes', rows: NOTES_BEHAVIOUR },
    ]}
  />
);

export const KnownLimits = () => <LimitsView rows={KNOWN_LIMITS} />;
