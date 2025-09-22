import { requireAdmin } from "@/lib/auth-guard";
import { Metadata } from "next";
import { getAllOrders, deleteOrderById } from "@/lib/actions/order.actions";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/shared/delete-dialog";

export const metadata: Metadata = {
	title: "Admin Orders",
};

const AdminOrdersPage = async (props: {
	searchParams: Promise<{ page: string; query: string }>;
}) => {
	await requireAdmin();
	const { page = 1, query } = await props.searchParams;

	const { data, totalPages } = await getAllOrders({
		page: Number(page),
		query,
	});

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-3">
				<h1 className="font-bold text-2xl lg:text-3xl">Orders</h1>
				{query && (
					<div>
						Filtered by <i>&quot;{query}&quot;</i>{" "}
						<Link href={`/admin/orders`}>
							<Button variant={"outline"} size={"sm"}>
								Remove Filter
							</Button>
						</Link>
					</div>
				)}
			</div>
			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>DATE</TableHead>
							<TableHead>BUYER</TableHead>
							<TableHead>TOTAL</TableHead>
							<TableHead className="text-center">PAID</TableHead>
							<TableHead className="text-center">
								DELIVERED
							</TableHead>
							<TableHead className="text-center">
								ACTION
							</TableHead>
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
									{order.user.name}
								</TableCell>
								<TableCell className="font-medium">
									{formatCurrency(order.totalPrice)}
								</TableCell>
								<TableCell className="font-medium text-center">
									{order.isPaid && order.paidAt
										? formatDateTime(order.paidAt).dateTime
										: "No"}
								</TableCell>
								<TableCell className="font-medium text-center">
									{order.isDelivered && order.deliveredAt
										? formatDateTime(order.deliveredAt)
												.dateTime
										: "No"}
								</TableCell>
								<TableCell className="text-right">
									<Button
										size={"sm"}
										asChild
										variant="outline"
									>
										<Link
											href={`/order/${order.id}`}
											// className="text-sm px-2 text-primary font-medium hover:underline"
										>
											Details
										</Link>
									</Button>
									<DeleteDialog
										id={order.id}
										action={deleteOrderById}
									/>
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

export default AdminOrdersPage;
