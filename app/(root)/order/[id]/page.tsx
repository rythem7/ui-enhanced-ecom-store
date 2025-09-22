import { Metadata } from "next";
import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-details-table";
import { Order, ShippingAddress } from "@/types";
import { auth } from "@/auth";
import Stripe from "stripe";

export const metadata: Metadata = {
	title: "Order Details",
};

const OrderDetailsPage = async ({
	params,
}: {
	params: Promise<{ id: string }>;
}) => {
	const { id } = await params;

	const order = (await getOrderById(id)) as Order | null;

	if (!order) notFound();

	const session = await auth();

	let client_secret: string | null = null;

	// If order is not paid, create a PaymentIntent to get client secret
	if (order.paymentMethod === "Stripe" && !order.isPaid) {
		const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
		const paymentIntent = await stripe.paymentIntents.create({
			amount: Math.round(Number(order.totalPrice) * 100), // amount in cents
			currency: "cad",
			metadata: { orderId: order.id },
		});
		client_secret = String(paymentIntent.client_secret);
	}

	return (
		<div>
			<h1>Order Details</h1>
			<OrderDetailsTable
				order={{
					...order,
					shippingAddress: order.shippingAddress as ShippingAddress,
				}}
				stripeClientSecret={client_secret}
				paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
				isAdmin={session?.user?.role === "admin" ? true : false}
			/>
		</div>
	);
};

export default OrderDetailsPage;
