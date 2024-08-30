'use client';

import { MoonIcon, SunIcon } from '@primer/octicons-react';
import { ActionList, ActionMenu, useTheme } from '@primer/react';

export function ThemeSwitcher() {
  const { setColorMode, colorMode } = useTheme();

  return (
    <ActionMenu>
      <ActionMenu.Button>
        {colorMode === 'light' ? <SunIcon /> : <MoonIcon />}
      </ActionMenu.Button>
      <ActionMenu.Overlay
        width="small"
        sx={{
          width: 'fit-content',
        }}
      >
        <ActionList>
          <ActionList.Item onClick={() => setColorMode('light')}>
            Light
          </ActionList.Item>
          <ActionList.Item onClick={() => setColorMode('dark')}>
            Dark
          </ActionList.Item>
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  );
}
