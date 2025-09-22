import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
	title: "Unauthorized",
};

export default function UnauthorizedPage() {
	return (
		<div className="flex flex-col items-center justify-center h-screen text-center">
			<h1 className="text-2xl lg:text-4xl font-bold">Unauthorized</h1>
			<p className="mt-4 text-muted-foreground">
				You do not have permission to view this page.
			</p>
			<Link href="/">
				<Button variant="outline" className="mt-8">
					Return Home
				</Button>
			</Link>
		</div>
	);
}
