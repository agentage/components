'use client';
import { Footer, FooterBottom, FooterLink, FooterSection, FooterSections } from '../../src';
import { Block } from '../components/demo';

export const Example = () => (
  <Block caption="A footer groups links into titled sections and ends with a bottom line for the copyright and social links.">
    <div className="overflow-hidden rounded-lg border border-border">
      <Footer className="border-t-0">
        <FooterSections>
          <FooterSection title="Product">
            <FooterLink href="#footer">Overview</FooterLink>
            <FooterLink href="#footer">Pricing</FooterLink>
            <FooterLink href="#footer">Changelog</FooterLink>
          </FooterSection>
          <FooterSection title="Developers">
            <FooterLink href="#footer">Docs</FooterLink>
            <FooterLink href="#footer">API</FooterLink>
            <FooterLink href="#footer">CLI</FooterLink>
          </FooterSection>
          <FooterSection title="Company">
            <FooterLink href="#footer">About</FooterLink>
            <FooterLink href="#footer">Blog</FooterLink>
            <FooterLink href="#footer">Contact</FooterLink>
          </FooterSection>
          <FooterSection title="Legal">
            <FooterLink href="#footer">Privacy</FooterLink>
            <FooterLink href="#footer">Terms</FooterLink>
          </FooterSection>
        </FooterSections>
        <FooterBottom copyright="© 2026 Example Co. All rights reserved.">
          <div className="flex items-center gap-3">
            <a href="#footer" className="transition-colors hover:text-foreground">
              Source
            </a>
            <a href="#footer" className="transition-colors hover:text-foreground">
              Feed
            </a>
          </div>
        </FooterBottom>
      </Footer>
    </div>
  </Block>
);
