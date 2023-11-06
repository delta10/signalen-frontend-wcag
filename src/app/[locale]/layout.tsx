import {notFound} from "next/navigation";
import React from "react";

const locales = ['en', 'nl'];

export default function LocaleLayout({ children, params: { locale }}: { children: React.ReactNode, params: { locale: any }}) {
  if(!locales.includes(locale as any)) notFound();

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  )
}
