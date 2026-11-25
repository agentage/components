/** The anchor of a page section, from its title: `Pagination: Example` is `pagination-example`. */
export const sectionId = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
