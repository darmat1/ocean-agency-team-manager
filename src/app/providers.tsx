'use client';

import { TeamProvider } from '@/context/TeamProvider';
import StyledComponentsRegistry from '@/lib/AntdRegistry';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <DndProvider backend={HTML5Backend}>
        <TeamProvider>
          {children}
        </TeamProvider>
      </DndProvider>
    </StyledComponentsRegistry>
  );
}