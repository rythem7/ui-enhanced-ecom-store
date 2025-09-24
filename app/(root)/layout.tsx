import Header from "@/components/shared/header";
import Footer from "@/components/Footer";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex min-h-screen flex-col bg-base-300">
			<Header />
			<main className="flex-1 max-w-7xl lg:mx-auto px-5 md:px-10 w-full">
				{children}
			</main>
			<Footer />
		</div>
	);
}
