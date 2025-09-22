import { Metadata } from "next";
import { getMyOrders } from "@/lib/actions/order.actions";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import Link from "next/link";
import {
	Table,
	TableHeader,
	TableHead,
	TableRow,
	TableBody,
	TableCell,
} from "@/components/ui/table";
import Pagination from "@/components/shared/pagination";

export const metadata: Metadata = {
	title: "My Orders",
};

const OrdersPage = async ({
	searchParams,
}: {
	searchParams: Promise<{ page: string }>;
}) => {
	const { page } = await searchParams;

	const { data, totalPages } = await getMyOrders({ page: Number(page) || 1 });
	return (
		<div className="space-y-2">
			<h2 className="font-bold text-2xl lg:text-3xl">My Orders</h2>
			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>DATE</TableHead>
							<TableHead>TOTAL</TableHead>
							<TableHead>PAID</TableHead>
							<TableHead>DELIVERED</TableHead>
							<TableHead>ACTION</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={6}
									className="text-center p-4"
								>
									No orders found.
								</TableCell>
							</TableRow>
						)}
						{data.map((order) => (
							<TableRow key={order.id}>
								<TableCell className="font-medium">
									{formatId(order.id)}
								</TableCell>
								<TableCell className="font-medium">
									{formatDateTime(order.createdAt).dateTime}
								</TableCell>
								<TableCell className="font-medium">
									{formatCurrency(order.totalPrice)}
								</TableCell>
								<TableCell className="font-medium">
									{order.isPaid && order.paidAt
										? formatDateTime(order.paidAt).dateTime
										: "No"}
								</TableCell>
								<TableCell className="font-medium">
									{order.isDelivered && order.deliveredAt
										? formatDateTime(order.deliveredAt)
												.dateTime
										: "No"}
								</TableCell>
								<TableCell>
									<Link
										href={`/order/${order.id}`}
										className="text-sm px-2 text-accent font-medium hover:underline"
									>
										Details
									</Link>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				{totalPages > 1 && (
					<div className="mt-4 flex justify-end">
						<Pagination
							page={Number(page) || 1}
							totalPages={totalPages}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default OrdersPage;
