import { getOrderById } from "@/lib/actions/order.actions";
import { notFound, redirect } from "next/navigation";
import Stripe from "stripe";
import { Order } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const SuccessPage = async (props: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ payment_intent: string }>;
}) => {
	const { id } = await props.params;
	const { payment_intent: paymentIntentId } = await props.searchParams;

	// Get order by ID
	const order = (await getOrderById(id)) as Order;
	if (!order) notFound();

	// Retrieve the PaymentIntent from Stripe
	const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

	if (
		!paymentIntent.metadata.orderId ||
		paymentIntent.metadata.orderId !== order.id
	) {
		return notFound();
	}

	// If Payment is successful
	const isSuccess = paymentIntent.status === "succeeded";
	if (!isSuccess) return redirect(`/order/${id}`);

	return (
		<div className="max-w-4xl w-full mx-auto space-y-8">
			<div className="flex flex-col gap-6 items-center">
				<h1 className="font-bold text-3xl lg:text-4xl">
					Thanks For Your Purchase
				</h1>
				<div>We are processing your order!</div>
				<Button asChild>
					<Link href={`/order/${id}`}>View Order</Link>
				</Button>
			</div>
		</div>
	);
};

export default SuccessPage;
