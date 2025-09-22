export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex justify-center items-center min-h-screen bg-base-300 w-full">
			{children}
		</div>
	);
}
