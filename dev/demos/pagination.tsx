'use client';
import { useState } from 'react';
import { Pagination } from '../../src';
import { Block } from '../components/demo';

export const Example = () => {
  const [page, setPage] = useState(1);
  return (
    <Block caption="Page buttons with previous and next; the current page is filled.">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">Page {page} of 12, 120 records</p>
        <Pagination page={page} pageCount={12} onPageChange={setPage} />
      </div>
    </Block>
  );
};

export const Variants = () => {
  const [page, setPage] = useState(3);
  return (
    <Block caption="A short range shows every page number.">
      <Pagination page={page} pageCount={5} onPageChange={setPage} />
    </Block>
  );
};

export const States = () => (
  <div className="space-y-5">
    <Block caption="On the first page, previous is disabled.">
      <Pagination page={1} pageCount={8} onPageChange={() => {}} />
    </Block>
    <Block caption="On the last page, next is disabled.">
      <Pagination page={8} pageCount={8} onPageChange={() => {}} />
    </Block>
  </div>
);
