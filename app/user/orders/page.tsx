import { Metadata } from "next";
import { Suspense } from "react";
import OrdersTableWrapper from "./orders-table-wrapper";

export const metadata: Metadata = {
	title: "My Orders",
};

const OrdersPage = async ({
	searchParams,
}: {
	searchParams: Promise<{ page: string }>;
}) => {
	const page = Number((await searchParams).page) || 1;
	return (
		<div className="space-y-4">
			<h2 className="font-bold font-heading text-2xl lg:text-3xl">
				My Orders
			</h2>
			<Suspense fallback={<div>Loading orders...</div>}>
				<OrdersTableWrapper page={page} />
			</Suspense>
		</div>
	);
};

export default OrdersPage;
