'use client';
import { NavLink } from '../../src';
import { Block } from '../components/demo';
import { HomeIcon, UserIcon } from '../lib/icons';

export const Example = () => (
  <Block caption="Deprecated. Use NavRow instead, or navRowVariants on your own link.">
    <nav aria-label="Example" className="w-56 space-y-0.5">
      <NavLink href="#nav-link" icon={<HomeIcon />} active>
        Overview
      </NavLink>
      <NavLink href="#nav-link" icon={<UserIcon />}>
        People
      </NavLink>
    </nav>
  </Block>
);
