import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export const SUPPORTED_LOCALES = ['en', 'uk'] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export default getRequestConfig(async () => {
  const headersList = await headers();
  const locale = headersList.get('X-NEXT-INTL-LOCALE') || 'en';
  
  if (!SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
    return {
      messages: (await import(`../messages/en.json`)).default,
      locale: 'en'
    };
  }

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
    locale: locale
  };
}); 