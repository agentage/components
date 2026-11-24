'use client';
import { Button, TopBar, TopBarActions, TopBarBrand, TopBarNav, TopBarNavItem } from '../../src';
import { Block } from '../components/demo';

export const Example = () => (
  <Block caption="A top bar holds the brand on the left, the main navigation next to it and the actions on the right.">
    <div className="overflow-hidden rounded-lg border border-border">
      <TopBar className="border-b-0">
        <TopBarBrand>
          <span className="text-primary">⟁</span>
          Example Co
        </TopBarBrand>
        <TopBarNav>
          <TopBarNavItem href="#top-bar" active>
            Product
          </TopBarNavItem>
          <TopBarNavItem href="#top-bar">Docs</TopBarNavItem>
          <TopBarNavItem href="#top-bar">Pricing</TopBarNavItem>
        </TopBarNav>
        <TopBarActions>
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
          <Button size="sm">Start free</Button>
        </TopBarActions>
      </TopBar>
    </div>
  </Block>
);

export const States = () => (
  <Block caption="The active item shows the current page; the others stay muted until hover.">
    <div className="overflow-hidden rounded-lg border border-border">
      <TopBar className="border-b-0">
        <TopBarBrand>Example Co</TopBarBrand>
        <TopBarNav>
          <TopBarNavItem href="#top-bar">Product</TopBarNavItem>
          <TopBarNavItem href="#top-bar" active>
            Docs
          </TopBarNavItem>
          <TopBarNavItem href="#top-bar">Pricing</TopBarNavItem>
        </TopBarNav>
      </TopBar>
    </div>
  </Block>
);
