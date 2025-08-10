'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeOutlined, TeamOutlined, RocketOutlined, CloseOutlined, ReloadOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { useTeam } from '@/hooks/useTeam';
import { Button } from 'antd';
import { useOverlay } from '@/hooks/useOverlay';

const navLinks = [
    { name: 'Dashboard', href: '/', icon: <HomeOutlined /> },
    { name: 'Team', href: '/team', icon: <TeamOutlined /> },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar: FC<SidebarProps> = ({ isOpen, onClose }) => {
    const pathname = usePathname();
    const { isDataModified, resetToDefault } = useTeam();
    const { addNotification } = useOverlay();

    const handleReset = () => {
        resetToDefault();
        addNotification('Data has been reset to default!', 'info');
        onClose();
    };

    return (<>
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            onClick={onClose}
        />
        <aside
            className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-40
                   transform transition-transform duration-300 ease-in-out 
                   md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
        >
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
                <Link href="/" onClick={onClose} className="flex items-center gap-2 text-xl font-bold text-gray-800">
                    <RocketOutlined className="text-gray-500" />
                    <span>TeamApp</span>
                </Link>
                <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-800">
                    <CloseOutlined />
                </button>
            </div>

            <nav className="flex-grow p-4">
                <ul>
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    onClick={onClose}
                                    className={`flex items-center gap-3 px-4 py-3 my-1 rounded-lg transition-colors ${isActive
                                        ? 'text-orange-950'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <span className="text-xl">{link.icon}</span>
                                    <span className="font-medium">{link.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <div className="mt-auto p-4">
                {isDataModified && (
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={handleReset}
                        block
                    >
                        Reset Data to Default
                    </Button>
                )}
            </div>
            <div className="p-4 border-t border-gray-200">
                <p className="text-xs text-center text-gray-500">© 2025 TeamApp Inc.</p>
            </div>
        </aside>
    </>
    );
};