'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SUPPORTED_LOCALES = ['en', 'uk'] as const;
type SupportedLocale = typeof SUPPORTED_LOCALES[number];

const LOCALE_NAMES: Record<SupportedLocale, string> = {
  en: 'English',
  uk: 'Українська'
};

export default function Navigation() {
  const locale = useLocale() as SupportedLocale;
  const router = useRouter();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as SupportedLocale;
    router.push(`/${newLocale}`);
  };

  return (
    <nav className="glass-card border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-400 font-bold">Green Blockchain</span>
            <span className="text-sm text-gray-400">Monitor</span>
          </div>
          
          {/* Language Selector */}
          <select
            value={locale}
            onChange={handleLanguageChange}
            className="glass-card px-3 py-1 rounded-md text-sm text-gray-300 bg-transparent border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            {SUPPORTED_LOCALES.map((loc) => (
              <option key={loc} value={loc}>
                {LOCALE_NAMES[loc]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </nav>
  );
} 