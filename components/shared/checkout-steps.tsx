import { cn } from "@/lib/utils";
import React from "react";

const CheckoutSteps = ({ current = 0 }) => {
	const steps = [
		"User Login",
		"Shipping Address",
		"Payment Method",
		"Place Order",
	];
	return (
		<div className="flex flex-col justify-center items-center md:flex-row md:gap-2 mb-10">
			{steps.map((step, index) => (
				<React.Fragment key={step}>
					<div
						className={cn(
							"p-2 w-56 rounded-full text-center text-sm"
						)}
					>
						<section
							className={cn(
								"flex flex-wrap justify-center",
								index === current
									? "bg-accent rounded-full px-4 py-2"
									: ""
							)}
						>
							{step}
						</section>
					</div>
					{step !== "Place Order" && (
						<hr className="w-16 border-t border-gray-300 mx-2" />
					)}
				</React.Fragment>
			))}
		</div>
	);
};

export default CheckoutSteps;
