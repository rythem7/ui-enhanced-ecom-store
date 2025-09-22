"use client";

import { loadStripe } from "@stripe/stripe-js";
import React, { useState } from "react";
import {
	Elements,
	LinkAuthenticationElement,
	PaymentElement,
	useElements,
	useStripe,
} from "@stripe/react-stripe-js";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { formatNumberToCurrency } from "@/lib/utils";
import { SERVER_URL } from "@/lib/constants";

const StripeForm = ({
	userEmail,
	priceInCents,
	orderId,
}: {
	userEmail: string;
	priceInCents: number;
	orderId: string;
}) => {
	const stripe = useStripe();
	const elements = useElements();

	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [email, setEmail] = useState(userEmail);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!stripe || !elements || !email) return;

		setIsLoading(true);
		setErrorMessage("");

		const result = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: `${SERVER_URL}/order/${orderId}/stripe-payment-success`,
			},
		});

		if (result.error) {
			if (
				result.error.type === "card_error" ||
				result.error.type === "validation_error"
			) {
				setErrorMessage(
					result.error.message || "An error occurred during payment."
				);
			} else {
				setErrorMessage(
					"An unexpected error occurred. Please try again."
				);
			}
		}
		setIsLoading(false);
	};

	return (
		<form className="space-y-4" onSubmit={handleSubmit}>
			{/* Add your Stripe form fields here */}
			<div className="text-xl">Stripe Checkout</div>
			{errorMessage && (
				<div className="text-destructive">{errorMessage}</div>
			)}
			<PaymentElement />
			<div>
				<LinkAuthenticationElement
					onChange={(e) => setEmail(e.value.email)}
					options={{ defaultValues: { email } }}
				/>
			</div>
			<button
				className="w-full btn btn-lg btn-primary text-primary-content"
				type="submit"
				disabled={!stripe || isLoading || !elements}
			>
				{isLoading
					? "Processing..."
					: `Pay ${formatNumberToCurrency(priceInCents / 100)}`}
			</button>
		</form>
	);
};

const StripePayment = ({
	priceInCents,
	orderId,
	clientSecret,
	userEmail = "",
}: {
	priceInCents: number;
	orderId: string;
	clientSecret: string | undefined;
	userEmail?: string;
}) => {
	const { theme, systemTheme } = useTheme();
	const [stripePromise] = useState(() =>
		loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)
	);

	const themeType = theme === "system" ? systemTheme : theme;

	return (
		<Elements
			options={{
				clientSecret,
				appearance: {
					theme: themeType === "dark" ? "night" : "stripe",
				},
			}}
			stripe={stripePromise}
		>
			<StripeForm
				userEmail={userEmail}
				priceInCents={priceInCents}
				orderId={orderId}
			/>
		</Elements>
	);
};

export default StripePayment;
