"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

// Static target date (replace with desired date)
const TARGET_DATE = new Date("2025-09-30T23:59:59Z");

// Function to calculate time remaining
const calculateTimeRemaining = (targetDate: Date) => {
	const now = new Date();
	const difference = targetDate.getTime() - now.getTime();
	const totalSeconds = Math.max(0, Math.floor(difference / 1000));
	const days = Math.floor(totalSeconds / 86400);
	const hours = Math.floor((totalSeconds % 86400) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	return { days, hours, minutes, seconds };
};

const DealCountdown = () => {
	const [timeRemaining, setTimeRemaining] =
		useState<ReturnType<typeof calculateTimeRemaining>>();

	useEffect(() => {
		setTimeRemaining(calculateTimeRemaining(TARGET_DATE));

		const intervalId = setInterval(() => {
			const newTime = calculateTimeRemaining(TARGET_DATE);
			setTimeRemaining(newTime);

			if (
				newTime.days === 0 &&
				newTime.hours === 0 &&
				newTime.minutes === 0 &&
				newTime.seconds === 0
			) {
				clearInterval(intervalId);
			}
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);

	if (!timeRemaining) {
		return (
			<section className="grid grid-cols-1 md:grid-cols-2">
				<div className="flex flex-col gap-2 justify-center">
					<h3 className="text-3xl font-bold">Loading Countdown...</h3>
				</div>
			</section>
		);
	}

	if (
		timeRemaining.days === 0 &&
		timeRemaining.hours === 0 &&
		timeRemaining.minutes === 0 &&
		timeRemaining.seconds === 0
	) {
		return (
			<section className="grid grid-cols-1 md:grid-cols-2 my-20 ">
				<div className="flex flex-col gap-2 justify-center">
					<h3 className="text-3xl font-bold">Deal Has Ended</h3>
					<p>
						This deal has ended. Please check back later for more
						exciting offers!
					</p>

					<div className="text-center">
						<Button asChild>
							<Link href="/search">View All Products</Link>
						</Button>
					</div>
				</div>
				<div className="flex justify-center">
					<Image
						src="/images/15-8.jpg"
						alt="Deal of the Month"
						width={300}
						height={200}
						className="w-auto h-full"
						priority
					/>
				</div>
			</section>
		);
	}

	return (
		<section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 md:mb-20 drop-shadow-md">
			<div className="flex flex-col gap-2 justify-center text-center items-center md:col-span-2">
				<h3 className="text-2xl font-heading font-medium">
					Deal of The Month
				</h3>
				<p>
					Get ready for a shopping experience like never before with
					our Deals of the Month! Every purchase comes with exclusive
					perks and offers, making this month a celebration of savvy
					choices and amazing deals. Don&apos;t miss out!
				</p>
				<ul className="grid grid-cols-4">
					<StatBox label="Days" value={timeRemaining.days} />
					<StatBox label="Hours" value={timeRemaining.hours} />
					<StatBox label="Minutes" value={timeRemaining.minutes} />
					<StatBox label="Seconds" value={timeRemaining.seconds} />
				</ul>
				<div className="text-center">
					<button className="btn btn-secondary rounded-full">
						<Link href="/search">Shop Now</Link>
					</button>
				</div>
			</div>
			<div className="flex justify-center">
				<Image
					src="/images/15-8.jpg"
					alt="Deal of the Month"
					width={300}
					height={200}
				/>
			</div>
		</section>
	);
};

const StatBox = ({ label, value }: { label: string; value: number }) => (
	<li className="p-4 w-full text-center">
		<p className="text-3xl font-bold">{value}</p>
		<p className="text-sm text-muted-foreground">{label}</p>
	</li>
);

export default DealCountdown;
