"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";
import { ACTIVE_OPTION_CLASS as activeClass } from "@/lib/constants";

const links = [
	{ href: "/user/profile", title: "Profile" },
	{ href: "/user/orders", title: "Orders" },
];

const MainNav = ({
	className,
	...props
}: React.HTMLAttributes<HTMLElement>) => {
	const pathname = usePathname();

	return (
		<nav
			className={cn(
				"flex items-center space-x-4 lg:space-x-6",
				className
			)}
			{...props}
		>
			{links.map((link) => {
				const isActive = link.href === pathname;
				return (
					<Link
						key={link.href}
						href={link.href}
						className={cn(
							"text-sm font-medium transition-colors hover:text-accent",
							isActive ? activeClass : "text-base-content"
						)}
					>
						{link.title}
					</Link>
				);
			})}
		</nav>
	);
};

export default MainNav;
