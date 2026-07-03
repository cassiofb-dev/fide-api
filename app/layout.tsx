import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
	title: "FIDE Ratings Tracker & Chess Statistics API",
	description: "Track, scrape, and search official FIDE chess ratings, player profiles, rating history charts, and game statistics with real-time caching.",
	keywords: ["chess", "FIDE", "ratings", "chess statistics", "chess scraper", "grandmaster ratings", "FIDE API", "chess database"],
	authors: [{ name: "Chess Analytics Team" }],
	openGraph: {
		title: "FIDE Ratings Tracker & Chess Statistics API",
		description: "Track, scrape, and search official FIDE chess ratings, player profiles, rating history charts, and game statistics.",
		siteName: "FIDE Ratings Tracker",
		images: [
			{
				url: "/favicon.svg",
				width: 512,
				height: 512,
				alt: "FIDE Ratings Tracker Logo",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary",
		title: "FIDE Ratings Tracker & Chess Statistics API",
		description: "Track, scrape, and search official FIDE chess ratings, player profiles, rating history charts, and game statistics.",
		images: ["/favicon.svg"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
		</html>
	);
}
