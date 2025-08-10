import { TeamMember } from '@/lib/types';
import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PhoneIcon } from '../icons/Phone';
import { TelegramIcon } from '../icons/Telegram';

interface TeamTableRowProps {
    member: TeamMember;
}

export const TeamTableRow: FC<TeamTableRowProps> = ({ member }) => {
    return (
        <tr className="block mb-4 rounded-lg border border-gray-200 md:table-row md:mb-0 md:border-0 md:border-b md:border-b-gray-300 md:hover:bg-gray-50 transition-colors">
            <td className="responsive-cell p-4 align-middle flex justify-between items-center text-right md:table-cell md:text-left md:align-middle border-b border-gray-200 md:border-0" data-label="Name">
                <Link
                    href={`/team/${member.id}`}
                    className="flex items-center gap-3 group"
                >
                    <div className="relative flex-shrink-0">
                        <Image
                            src={member.avatar}
                            alt={member.name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                        />
                        <span
                            className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-white ${member.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                                }`}
                        ></span>
                    </div>
                    <span className="font-medium group-hover:underline">{member.name}</span>
                </Link>
            </td>
            <td className="responsive-cell flex justify-between items-center p-4 text-right md:table-cell md:text-left md:align-middle text-gray-600" data-label="Role">{member.role}</td>
            <td className="responsive-cell flex justify-between items-center p-4 text-right md:table-cell md:text-left md:align-middle text-gray-600" data-label="Department">{member.department}</td>
            <td className="responsive-cell flex justify-between items-center p-4 text-right md:table-cell md:text-left md:align-middle text-gray-600 text-sm" data-label="Contact">
                <div className='flex flex-col'>
                    <div className='flex items-center gap-1'><PhoneIcon /> {member.phone}</div>
                    <div className='flex items-center gap-1'><TelegramIcon /> {member.telegram}</div>
                </div>
            </td>
        </tr>
    );
};