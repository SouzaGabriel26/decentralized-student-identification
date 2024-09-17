'use client';

import { PersonIcon, SignOutIcon } from '@primer/octicons-react';
import { ActionList, ActionMenu, Box, Text } from '@primer/react';

type UserMenuProps = {
  name: string;
  signOut: () => Promise<void>;
};

export function UserMenu({ name, signOut }: UserMenuProps) {
  return (
    <ActionMenu>
      <ActionMenu.Button>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <PersonIcon />
          <Text>{name}</Text>
        </Box>
      </ActionMenu.Button>
      <ActionMenu.Overlay
        width="small"
        sx={{
          width: 'fit-content',
        }}
      >
        <ActionList>
          <ActionList.Item
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'space-between',
            }}
            as="button"
            type="submit"
            onClick={async () => await signOut()}
          >
            <ActionList.LeadingVisual>
              <SignOutIcon />
            </ActionList.LeadingVisual>
            <Text>Sair</Text>
          </ActionList.Item>
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  );
}
