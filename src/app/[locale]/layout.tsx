import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { notFound, redirect } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import Navigation from '@/app/components/Navigation';
import { headers } from 'next/headers';

const inter = Inter({ subsets: ['latin'] });

const SUPPORTED_LOCALES = ['en', 'uk'] as const;
type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const metadata: Metadata = {
  title: 'Green Blockchain Monitor',
  description: 'Monitor and analyze blockchain environmental impact',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      }
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'uk' }];
}

async function getPreferredLocale(): Promise<SupportedLocale> {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language');
  
  if (!acceptLanguage) return 'en';

  // Parse the Accept-Language header
  const browserLocales = acceptLanguage.split(',')
    .map((language: string) => {
      const [locale, priority] = language.split(';q=');
      return {
        locale: locale.trim().split('-')[0], // Get primary language tag
        priority: priority ? Number(priority) : 1.0
      };
    })
    .sort((a, b) => b.priority - a.priority);

  // Find the first supported locale
  const preferredLocale = browserLocales.find(({ locale }) => 
    SUPPORTED_LOCALES.includes(locale as SupportedLocale)
  );

  return (preferredLocale ? preferredLocale.locale : 'en') as SupportedLocale;
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // If no locale is specified in the URL, redirect to the preferred locale
  if (!locale) {
    const preferredLocale = await getPreferredLocale();
    redirect(`/${preferredLocale}`);
  }

  // If the locale is not supported, redirect to the preferred locale
  if (!SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
    const preferredLocale = await getPreferredLocale();
    redirect(`/${preferredLocale}`);
  }

  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <div className="min-h-screen bg-gradient-to-b from-[#0A0F1E] to-[#1A1E2D]">
            <div className="crypto-grid" />
            <Navigation />
            <main className="relative z-10">
              {children}
            </main>
            <Toaster 
              position="bottom-center"
              toastOptions={{
                className: 'glass-card',
                style: {
                  background: 'rgba(30, 41, 59, 0.9)',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '16px',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }
              }}
            />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 