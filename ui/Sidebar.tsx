'use client';

import {
  HomeIcon,
  IdBadgeIcon,
  InfoIcon,
  ListUnorderedIcon,
  PersonIcon,
} from '@primer/octicons-react';
import { Box, NavList } from '@primer/react';
import { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

type NavItemProps = {
  title: string;
  href: Route;
  icon: ReactNode;
  auth: {
    isPrivate: boolean;
    onlyAdmin?: boolean;
  };
};

export function Sidebar() {
  const pathname = usePathname();
  const isUserLoggedIn = true;
  const isUserAdmin = true;

  return (
    <Box
      as="aside"
      sx={{
        flex: 1,
        pt: 3,
        maxWidth: 'fit-content',
        borderRight: '1px solid',
      }}
    >
      <NavList
        sx={{
          '& > ul': {
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          },
        }}
      >
        {navItems.map((item) => {
          if (!isUserLoggedIn && item.auth.isPrivate) return null;
          if (!isUserAdmin && item.auth.onlyAdmin) return null;

          return (
            <NavListItem key={item.href} item={item} pathname={pathname} />
          );
        })}
      </NavList>
    </Box>
  );
}

type NavListItemProps = {
  item: NavItemProps;
  pathname: string;
};

function NavListItem({ item, pathname }: NavListItemProps) {
  return (
    <NavList.Item
      sx={{
        width: 224,
      }}
      as={Link}
      href={item.href}
      aria-current={item.href === pathname}
    >
      <NavList.LeadingVisual>{item.icon}</NavList.LeadingVisual>
      {item.title}
    </NavList.Item>
  );
}

const navItems: Array<NavItemProps> = [
  {
    title: 'Início',
    href: '/',
    icon: <HomeIcon />,
    auth: {
      isPrivate: false,
    },
  },
  {
    title: 'Cadastro',
    href: '/register',
    icon: <PersonIcon />,
    auth: {
      isPrivate: false,
    },
  },
  {
    title: 'Status',
    href: '/student-card/status',
    icon: <InfoIcon />,
    auth: {
      isPrivate: true,
    },
  },
  {
    title: 'Carteira estudantil',
    href: '/student-card',
    icon: <IdBadgeIcon />,
    auth: {
      isPrivate: true,
    },
  },
  {
    title: 'Solicitações pendentes',
    href: '/pending-cards',
    icon: <ListUnorderedIcon />,
    auth: {
      isPrivate: true,
      onlyAdmin: true,
    },
  },
];
