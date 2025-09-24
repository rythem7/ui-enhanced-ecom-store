import { Metadata } from "next";
import { Suspense } from "react";
import OrderDetailsWrapper from "./order-details-wrapper";

export const metadata: Metadata = {
	title: "Order Details",
};

const OrderDetailsPage = async ({
	params,
}: {
	params: Promise<{ id: string }>;
}) => {
	const { id } = await params;

	return (
		<div>
			<Suspense fallback={<div>Loading order details...</div>}>
				<OrderDetailsWrapper id={id} />
			</Suspense>
		</div>
	);
};

export default OrderDetailsPage;
