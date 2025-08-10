'use client';
import { MenuOutlined } from '@ant-design/icons';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center">
      <button onClick={onMenuClick} className="text-gray-600 hover:text-gray-900">
        <MenuOutlined className="text-xl" />
      </button>
      <div className="flex-grow text-center font-bold text-lg">
        TeamApp
      </div>
    </header>
  );
};