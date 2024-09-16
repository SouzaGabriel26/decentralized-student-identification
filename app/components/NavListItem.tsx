'use client';

import { NavItemProps } from '@/utils/navItems';
import { NavList, Text } from '@primer/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavListItemProps = {
  item: NavItemProps;
};

export function NavListItem({ item }: NavListItemProps) {
  const pathname = usePathname();

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
