'use client';

import { OverlayProvider } from '@/context/OverlayProvider';
import { TeamProvider } from '@/context/TeamProvider';
import StyledComponentsRegistry from '@/lib/AntdRegistry';
import { App } from 'antd';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <TeamProvider>
            <App>
                <StyledComponentsRegistry>
                    <OverlayProvider>
                        {children}
                    </OverlayProvider>
                </StyledComponentsRegistry>
            </App>
        </TeamProvider>
    );
}