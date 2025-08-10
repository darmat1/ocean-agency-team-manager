'use client';

import { OverlayProvider } from '@/context/OverlayProvider';
import { TeamProvider } from '@/context/TeamProvider';
import StyledComponentsRegistry from '@/lib/AntdRegistry';

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <OverlayProvider>
            <TeamProvider>
                <StyledComponentsRegistry>
                    {children}
                </StyledComponentsRegistry>
            </TeamProvider>
        </OverlayProvider>
    );
}