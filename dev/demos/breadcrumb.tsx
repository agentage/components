'use client';
import { Fragment } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../src';
import { Block } from '../components/demo';

export const Example = () => (
  <Block caption="Links lead back up the hierarchy; the last item is the current page.">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Reports</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Quarterly summary</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </Block>
);

export const Variants = () => (
  <Block caption="The path variant shows mono segments and scrolls sideways when it is too long.">
    <Breadcrumb variant="path" className="max-w-xs">
      <BreadcrumbList>
        {['workspace', 'documents', 'release-notes', 'drafts'].map((seg) => (
          <Fragment key={seg}>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">{seg}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </Fragment>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage>summary.md</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </Block>
);
