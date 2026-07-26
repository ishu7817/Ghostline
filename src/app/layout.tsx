import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner"
import Navbar from "@/components/Navbar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Ghostline — Anonymous Messaging & AI Frequencies',
  description: 'An premium anonymous messaging platform. Drop untraceable messages with AI-generated suggestions to break the ice.',
  keywords: ['Ghostline', 'anonymous messaging', 'secure feedback', 'AI messaging', 'ishusyncs', 'SaaS'],
  authors: [{ name: 'Nimesh Mangal' }],
  metadataBase: new URL('https://ghstline.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Ghostline — Anonymous Messaging',
    description: 'Send what you can\'t say. Secure, untraceable, and AI-assisted.',
    url: 'https://ghstline.vercel.app',
    siteName: 'Ghostline',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  verification: {
    google: 'JO_EFWyqNBiE-_MfRSmzFJMzH4oNpImQKXyOf2EXJFY',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <AuthProvider>
      <body className="min-h-full flex flex-col">{children}
        
                <Toaster />

      </body>
      </AuthProvider>
    </html>
  );
}
