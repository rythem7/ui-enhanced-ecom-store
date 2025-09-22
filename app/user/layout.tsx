import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/shared/header/menu";
import MainNav from "./main-nav";

export default function UserLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex min-h-screen flex-col">
			<div className="border-b max-w-7xl lg:mx-auto p-5 md:px-10 w-full flex justify-between items-center">
				<div className="flex justify-start items-center">
					<Link
						href="/"
						className="flex gap-4 items-center font-semibold"
					>
						<Image
							src="/images/logo.svg"
							alt={APP_NAME}
							width={48}
							height={48}
						/>
						{/* <span className="hidden lg:block font-bold text-2xl">
							{APP_NAME}
						</span> */}
					</Link>
					{/* Main Nav */}
					<MainNav className="ml-10 hidden md:flex" />
				</div>
				<div className="ml-auto items-center flex space-x-4">
					<Menu />
				</div>
			</div>
			<div className="flex-1 space-y-4 p-8 pt-6 container max-w-7xl mx-auto">
				{children}
			</div>
		</div>
	);
}
