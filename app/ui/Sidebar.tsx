'use client';

import {
  HomeIcon,
  IdBadgeIcon,
  InfoIcon,
  ListUnorderedIcon,
  PersonIcon,
} from '@primer/octicons-react';
import { Box, NavList, Text } from '@primer/react';
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
  const isUserLoggedIn = false;
  const isUserAdmin = false;

  return (
    <Box
      as="aside"
      sx={{
        flex: 1,
        pt: 3,
        maxWidth: 'fit-content',
        borderRight: '1px solid',
        borderColor: 'border.default',
        bg: 'canvas.subtle',
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
        '@media (min-width: 1920px)': {
          width: 224,
        },
        '@media (min-width: 480px) and (max-width: 1919px)': {
          width: 170,
        },
      }}
      as={Link}
      href={item.href}
      aria-current={item.href === pathname}
    >
      <NavList.LeadingVisual
        sx={{
          '@media (max-width: 480px)': {
            marginX: 'auto',
          },
        }}
      >
        {item.icon}
      </NavList.LeadingVisual>
      <Text
        sx={{
          '@media (max-width: 1919px)': {
            fontSize: '12px',
          },
          '@media (max-width: 480px)': {
            display: 'none',
          },
        }}
      >
        {item.title}
      </Text>
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
