// app/order/[id]/order-details-wrapper.tsx
import { getOrderById } from "@/lib/actions/order.actions";
import { auth } from "@/auth";
import Stripe from "stripe";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-details-table";
import type { Order, ShippingAddress } from "@/types";

export default async function OrderDetailsWrapper({ id }: { id: string }) {
	const order = (await getOrderById(id)) as Order | null;

	if (!order) notFound();

	const session = await auth();

	let client_secret: string | null = null;

	if (order.paymentMethod === "Stripe" && !order.isPaid) {
		const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
		const paymentIntent = await stripe.paymentIntents.create({
			amount: Math.round(Number(order.totalPrice) * 100),
			currency: "cad",
			metadata: { orderId: order.id },
		});
		client_secret = String(paymentIntent.client_secret);
	}

	return (
		<>
			<OrderDetailsTable
				order={{
					...order,
					shippingAddress: order.shippingAddress as ShippingAddress,
				}}
				stripeClientSecret={client_secret}
				paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
				isAdmin={session?.user?.role === "admin"}
			/>
		</>
	);
}
