// app/orders/orders-table-wrapper.tsx
import { getMyOrders } from "@/lib/actions/order.actions";
import { formatId, formatDateTime, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/shared/pagination";

export default async function OrdersTableWrapper({ page }: { page: number }) {
	const { data, totalPages } = await getMyOrders({ page });

	return (
		<div className="overflow-x-auto rounded-box bg-base-200">
			<Table>
				<TableHeader>
					<TableRow className="bg-base-100">
						<TableHead>DATE</TableHead>
						<TableHead>TOTAL</TableHead>
						<TableHead>PAID</TableHead>
						<TableHead>DELIVERED</TableHead>
						<TableHead className="pl-5">ACTION</TableHead>
						<TableHead>ID</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.length === 0 && (
						<TableRow>
							<TableCell colSpan={6} className="text-center p-4">
								No orders found.
							</TableCell>
						</TableRow>
					)}
					{data.map((order) => (
						<TableRow key={order.id}>
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
									? formatDateTime(order.deliveredAt).dateTime
									: "No"}
							</TableCell>
							<TableCell>
								<Link href={`/order/${order.id}`}>
									<button className="btn btn-soft btn-primary">
										Details
									</button>
								</Link>
							</TableCell>
							<TableCell className="font-medium">
								{formatId(order.id)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{totalPages > 1 && (
				<div className="mt-4 flex justify-end">
					<Pagination page={page} totalPages={totalPages} />
				</div>
			)}
		</div>
	);
}
