import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Montserrat, Roboto } from "next/font/google";
import "@/assets/styles/globals.css";
import { APP_NAME, APP_DESCRIPTION, SERVER_URL } from "@/lib/constants";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const montserrat = Montserrat({
	subsets: ["latin"],
	variable: "--font-montserrat",
	display: "swap",
	weight: ["400", "500", "600", "700"], // for headings
});

const roboto = Roboto({
	subsets: ["latin"],
	variable: "--font-roboto",
	display: "swap",
	weight: ["300", "400", "500"], // for body text
});

export const metadata: Metadata = {
	title: {
		template: `%s | ${APP_NAME}`,
		default: APP_NAME,
	},
	description: APP_DESCRIPTION,
	metadataBase: new URL(SERVER_URL),
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${inter.variable} ${montserrat.variable} ${roboto.variable}`}
			>
				<ThemeProvider
					attribute="data-theme"
					defaultTheme="luxury"
					enableSystem
					disableTransitionOnChange
				>
					{children}
					<Toaster richColors={true} />
				</ThemeProvider>
			</body>
		</html>
	);
}
