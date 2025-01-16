'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
    HomeIcon,
    ChartBarIcon, 
    LightBulbIcon,
    Cog6ToothIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function Navigation() {
    const pathname = usePathname();

    const navigation = [
        {
            name: 'Dashboard',
            href: '/',
            icon: HomeIcon,
            current: pathname === '/'
        },
        {
            name: 'Analytics',
            href: '/analytics',
            icon: ChartBarIcon,
            current: pathname === '/analytics'
        },
        {
            name: 'Insights',
            href: '/insights',
            icon: LightBulbIcon,
            current: pathname === '/insights'
        },
        {
            name: 'Documentation',
            href: '/docs',
            icon: DocumentTextIcon,
            current: pathname === '/docs'
        },
        {
            name: 'Admin',
            href: '/admin',
            icon: Cog6ToothIcon,
            current: pathname === '/admin'
        }
    ];

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="text-xl font-bold text-green-600">
                                🌱 Green Blockchain Monitor
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                                        inline-flex items-center px-1 pt-1 border-b-2
                                        text-sm font-medium
                                        ${item.current
                                            ? 'border-green-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        }
                                    `}
                                >
                                    <item.icon className="h-5 w-5 mr-2" />
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className="sm:hidden">
                <div className="pt-2 pb-3 space-y-1">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                                flex items-center px-3 py-2 text-base font-medium
                                ${item.current
                                    ? 'bg-green-50 border-l-4 border-green-500 text-green-700'
                                    : 'border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                                }
                            `}
                        >
                            <item.icon className="h-5 w-5 mr-2" />
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
} 