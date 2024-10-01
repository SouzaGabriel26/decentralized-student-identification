import {
  ChecklistIcon,
  HomeIcon,
  IdBadgeIcon,
  InfoIcon,
  ListUnorderedIcon,
  PersonIcon,
  SignInIcon,
} from '@primer/octicons-react';
import { Route } from 'next';
import { ReactNode } from 'react';

export type NavItemProps = {
  title: string;
  href: Route;
  icon: ReactNode;
  auth: {
    isPrivate: boolean;
    onlyAdmin?: boolean;
    onlyStudent?: boolean;
    onlyNotSignedIn?: boolean;
  };
};

export const navItems: Array<NavItemProps> = [
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
      onlyNotSignedIn: true,
    },
  },
  {
    title: 'Login',
    href: '/login',
    icon: <SignInIcon />,
    auth: {
      isPrivate: false,
      onlyNotSignedIn: true,
    },
  },
  {
    title: 'Status',
    href: '/student-card/status',
    icon: <InfoIcon />,
    auth: {
      isPrivate: true,
      onlyStudent: true,
    },
  },
  {
    title: 'Carteira estudantil',
    href: '/student-card',
    icon: <IdBadgeIcon />,
    auth: {
      isPrivate: true,
      onlyStudent: true,
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
  {
    title: 'Carteiras emitidas',
    href: '/issued-cards',
    icon: <ChecklistIcon />,
    auth: {
      isPrivate: true,
      onlyAdmin: true,
    },
  },
  {
    title: 'Alterar cadastro',
    href: '/update-profile',
    icon: <PersonIcon />,
    auth: {
      isPrivate: true,
      onlyStudent: true,
    },
  },
];
