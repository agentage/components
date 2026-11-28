import { type PagesContext, type PagesSite } from '@agentage/extension';
import { siteAt } from './site.js';

export const create = (ctx: PagesContext): PagesSite => siteAt(ctx.extension.origin);
