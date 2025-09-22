import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSalesData } from "@/lib/actions/order.actions";
import { BadgeDollarSign, Barcode, CreditCard, Users } from "lucide-react";
import { Metadata } from "next";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import Charts from "./charts";
import { requireAdmin } from "@/lib/auth-guard";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
	title: "Admin Dashboard",
};

const OverviewPage = async () => {
	await requireAdmin();
	const session = await auth();
	if (!session?.user || session.user.role !== "admin") {
		throw new Error("User is not authorized");
	}

	const summary = await getSalesData();
	return (
		<div className="space-y-2">
			<h1 className="h2-bold">Dashboard</h1>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Revenue
						</CardTitle>
						<BadgeDollarSign />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatCurrency(summary.totalSales)}
						</div>
					</CardContent>
				</Card>
				<Card>
					<Link href="/admin/orders">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Sales
							</CardTitle>
							<CreditCard />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{Number(summary.totalOrders)}
							</div>
						</CardContent>
					</Link>
				</Card>
				<Card>
					<Link href="/admin/users">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Customers
							</CardTitle>
							<Users />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{summary.totalUsers}
							</div>
						</CardContent>
					</Link>
				</Card>
				<Card>
					<Link href="/admin/products">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Products
							</CardTitle>
							<Barcode />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{summary.totalProducts}
							</div>
						</CardContent>
					</Link>
				</Card>
			</div>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				<Card className="col-span-4">
					<CardHeader>
						<CardTitle>Sales Overview</CardTitle>
					</CardHeader>
					<CardContent>
						<Charts data={{ salesData: summary.salesData }} />
					</CardContent>
				</Card>
				<Card className="col-span-3">
					<CardHeader>
						<CardTitle>Recent Sales</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>BUYER</TableHead>
									<TableHead>DATE</TableHead>
									<TableHead>TOTAL</TableHead>
									<TableHead>ACTIONS</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{summary.latestSales.map((sale) => (
									<TableRow key={sale.id}>
										<TableCell>
											{sale?.user?.name}
										</TableCell>
										<TableCell>
											{
												formatDateTime(sale.createdAt)
													.dateOnly
											}
										</TableCell>
										<TableCell>
											{formatCurrency(sale.totalPrice)}
										</TableCell>
										<TableCell>
											{/* <Link href={`/order/${sale.id}`}>
												<span className="px-2">
													Details
												</span>
											</Link> */}
											<Button
												size={"sm"}
												asChild
												variant="outline"
											>
												<Link
													href={`/order/${sale.id}`}
													// className="text-sm px-2 text-primary font-medium hover:underline"
												>
													Details
												</Link>
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default OverviewPage;
