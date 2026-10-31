import type {Metadata} from 'next';
import {Plus_Jakarta_Sans, JetBrains_Mono} from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ROSE AI OS — Agency Operating System',
  description:
    'Enterprise AI operating system for ROSE AI Agency to orchestrate client operations, autonomous AI agents, multi-step automations, integrations, and client portals.',
  openGraph: {
    title: 'ROSE AI OS — Agency Operating System',
    description:
      'Enterprise AI operating system for ROSE AI Agency to orchestrate client operations, autonomous AI agents, multi-step automations, integrations, and client portals.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ROSE AI OS — Agency Operating System',
    description:
      'Enterprise AI operating system for ROSE AI Agency to orchestrate client operations, autonomous AI agents, multi-step automations, integrations, and client portals.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${jetbrainsMono.variable} dark`}>
      <body
        suppressHydrationWarning
        className="bg-[#08060D] text-[#F4F2F8] font-sans antialiased selection:bg-[#CCF655]/25 selection:text-[#CCF655] overflow-x-hidden"
      >
        {children}
      </body>
    </html>
  );
}
