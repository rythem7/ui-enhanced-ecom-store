"use client";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const NotFound = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-6 gap-4">
			<Image
				src={"/images/logo.svg"}
				width={48}
				height={48}
				alt={`${APP_NAME} logo`}
				priority
			/>
			<div className="md:w-1/3 rounded-lg text-center">
				<h1 className="text-3xl font-bold mb-2 font-heading">
					Not Found!
				</h1>
				<p className="text-error font-body">
					Could not find requested page
				</p>
				<Button
					variant={"outline"}
					className="mt-4 ml-2"
					onClick={() => (window.location.href = "/")}
				>
					Back To Home
				</Button>
			</div>
		</div>
	);
};

export default NotFound;
