import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

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
				url: "https://res.cloudinary.com/dfgecuoqu/image/upload/v1783208902/ChatGPT_Image_4_de_jul._de_2026_20_47_53_wftiws.jpg",
				width: 1200,
				height: 630,
				alt: "FIDE Ratings Tracker & Chess Statistics API Preview",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "FIDE Ratings Tracker & Chess Statistics API",
		description: "Track, scrape, and search official FIDE chess ratings, player profiles, rating history charts, and game statistics.",
		images: ["https://res.cloudinary.com/dfgecuoqu/image/upload/v1783208902/ChatGPT_Image_4_de_jul._de_2026_20_47_53_wftiws.jpg"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
				<script
					dangerouslySetInnerHTML={{
						__html: `
							(function() {
								try {
									var saved = localStorage.getItem('theme');
									if (saved) {
										document.documentElement.className = saved;
									} else {
										document.documentElement.className = 'dark';
									}
								} catch (e) {}
							})()
						`,
					}}
				/>
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
				<ThemeProvider>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
