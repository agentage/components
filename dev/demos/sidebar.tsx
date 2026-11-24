'use client';
import { useState } from 'react';
import {
  Avatar,
  NavRow,
  NavTree,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from '../../src';
import { Block } from '../components/demo';
import { BrandedLogo, HomeIcon, MailIcon, ServerIcon, UserIcon } from '../lib/icons';

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-[360px] overflow-hidden rounded-lg border border-border">{children}</div>
);

export const Example = () => {
  const [current, setCurrent] = useState('home');
  const row = (id: string) => ({
    selected: current === id,
    onClick: () => {
      setCurrent(id);
    },
  });
  return (
    <Block caption="A sidebar with a header, grouped NavRow rows and a footer. Rows live in a NavTree inside each SidebarGroup.">
      <Shell>
        <Sidebar width="w-56" aria-label="Main">
          <SidebarHeader>
            <BrandedLogo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <NavTree aria-label="Main">
                <NavRow icon={<HomeIcon />} {...row('home')}>
                  Dashboard
                </NavRow>
                <NavRow icon={<ServerIcon />} count={4} {...row('machines')}>
                  Machines
                </NavRow>
                <NavRow icon={<MailIcon />} pill={2} {...row('alerts')}>
                  Alerts
                </NavRow>
              </NavTree>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <NavTree aria-label="Settings">
                <NavRow icon={<UserIcon />} {...row('profile')}>
                  Profile
                </NavRow>
              </NavTree>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center gap-2">
              <Avatar name="Ada Lovelace" size="sm" />
              <div className="min-w-0">
                <p className="truncate text-ui font-medium">Ada Lovelace</p>
                <p className="truncate text-xs text-muted-foreground">ada@example.com</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 bg-background p-4 text-ui text-muted-foreground">Page content.</div>
      </Shell>
    </Block>
  );
};

export const Variants = () => (
  <Block caption="Width sets the column; this narrow sidebar has one group and no footer.">
    <Shell>
      <Sidebar width="w-44" aria-label="Compact">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Library</SidebarGroupLabel>
            <NavTree aria-label="Library">
              <NavRow icon={<HomeIcon />} selected>
                Overview
              </NavRow>
              <NavRow icon={<ServerIcon />}>Services</NavRow>
            </NavTree>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <div className="flex-1 bg-background" />
    </Shell>
  </Block>
);
