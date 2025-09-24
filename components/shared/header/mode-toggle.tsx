"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuLabel,
	DropdownMenuContent,
	DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { THEME_OPTIONS } from "@/lib/constants";

type ThemeOption = {
	name: string;
	icon: React.ReactNode;
};

// interface ModeToggleProps {
// 	themes: ThemeOption[];
// }

const ModeToggle = () => {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	const themes: ThemeOption[] = THEME_OPTIONS;

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	// pick the active theme's icon, fallback to first one
	const activeIcon =
		themes.find((t) => t.name === theme)?.icon ?? themes[0]?.icon;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant={"ghost"}
					className="focus-visible:ring-0 focus-visible:ring-offset-0"
				>
					{activeIcon}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="bg-base-200/40 backdrop-blur-lg border-0 text-base-content">
				<DropdownMenuLabel className="font-bold font-heading">
					Appearance
				</DropdownMenuLabel>
				{themes.map((t) => (
					<DropdownMenuCheckboxItem
						key={t.name}
						checked={theme === t.name}
						onClick={() => setTheme(t.name)}
					>
						<div className="flex items-center gap-2">
							{t.icon}
							<span className="capitalize">{t.name}</span>
						</div>
					</DropdownMenuCheckboxItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ModeToggle;
