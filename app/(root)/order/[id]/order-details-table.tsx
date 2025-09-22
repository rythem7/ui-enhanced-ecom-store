"use client";

import { useTransition } from "react";
import { Order } from "@/types";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import {
	PayPalButtons,
	PayPalScriptProvider,
	usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import {
	createPayPalOrder,
	approvePayPalOrder,
	updateOrderToPaidCOD,
	deliverOrder,
} from "@/lib/actions/order.actions";
import StripePayment from "./stripe-payment";

const OrderDetailsTable = ({
	order,
	paypalClientId,
	isAdmin,
	stripeClientSecret,
}: {
	order: Order;
	paypalClientId: string;
	isAdmin: boolean;
	stripeClientSecret: string | null;
}) => {
	const {
		id,
		shippingAddress,
		orderitems,
		itemsPrice,
		shippingPrice,
		taxPrice,
		totalPrice,
		paymentMethod,
		isDelivered,
		isPaid,
		paidAt,
		deliveredAt,
	} = order;

	const PrintLoadingState = () => {
		const [{ isPending, isRejected }] = usePayPalScriptReducer();
		return (
			<div>
				{isPending && (
					<div className="text-center my-2">Loading...</div>
				)}
				{isRejected && (
					<div className="text-center my-2 text-red-500">
						Error in loading PayPal script!
					</div>
				)}
			</div>
		);
	};

	const handleCreatePaypalOrder = async () => {
		const res = await createPayPalOrder(id);

		if (!res.success)
			return toast.error(res.message || "Error in creating PayPal order");

		toast.success(res.message || "PayPal order created successfully");
		return res.data;
	};

	const handleApprovePaypalOrder = async (data: { orderID: string }) => {
		const res = await approvePayPalOrder(id, data);

		if (!res.success) {
			toast.error(res.message);
		}

		toast.success(res.message);
	};

	const MarkAsPaidButton = () => {
		const [isPending, startTransition] = useTransition();

		const handleMarkAsPaid = () => {
			startTransition(async () => {
				const res = await updateOrderToPaidCOD(id);
				if (res.success) {
					toast.success(res.message);
				} else {
					toast.error(res.message);
				}
			});
		};

		return (
			<button
				onClick={handleMarkAsPaid}
				className="btn btn-warning text-warning-content"
				disabled={isPending}
			>
				{isPending ? "processing..." : "Mark as Paid"}
			</button>
		);
	};

	const MarkAsDeliveredButton = () => {
		const [isPending, startTransition] = useTransition();

		const handleMarkAsDelivered = () => {
			startTransition(async () => {
				const res = await deliverOrder(id);
				if (res.success) {
					toast.success(res.message);
				} else {
					toast.error(res.message);
				}
			});
		};

		return (
			<button
				onClick={handleMarkAsDelivered}
				className="btn btn-warning text-warning-content"
				disabled={isPending}
			>
				{isPending ? "processing..." : "Mark as Delivered"}
			</button>
		);
	};
	return (
		<>
			<h2 className="text-2xl py-4">Order {formatId(id)}</h2>
			<div className="grid md:grid-cols-3 gap-5">
				<div className="col-span-2 space-y-4 overflow-x-auto">
					<Card>
						<CardContent className="p-4 gap-4">
							<h2 className="text-xl pb-4">Payment Method</h2>
							<p className="mb-2">{paymentMethod}</p>
							{isPaid ? (
								<Badge variant={"secondary"}>
									Paid at {formatDateTime(paidAt!).dateTime}
								</Badge>
							) : (
								<Badge variant={"destructive"}>Not paid</Badge>
							)}
						</CardContent>
					</Card>
					<Card className="my-2">
						<CardContent className="p-4 gap-4">
							<h2 className="text-xl pb-4">Shipping Address</h2>
							<p>{shippingAddress.fullName}</p>
							<p>
								{shippingAddress.streetAddress},{" "}
								{shippingAddress.city}
							</p>
							<p className="mb-2">
								{shippingAddress.postalCode},{" "}
								{shippingAddress.country}
							</p>
							{isDelivered ? (
								<Badge variant={"secondary"}>
									Delivered at{" "}
									{formatDateTime(deliveredAt!).dateTime}
								</Badge>
							) : (
								<Badge variant={"destructive"}>
									Not delivered
								</Badge>
							)}
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4 gap-4">
							<h2 className="text-xl pb-4">Order Items</h2>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Item</TableHead>
										<TableHead>Quantity</TableHead>
										<TableHead className="text-right">
											Price
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{orderitems.map((item) => (
										<TableRow key={item.slug}>
											<TableCell>
												<Link
													href={`/product/${item.slug}`}
													className="hover:underline flex items-center gap-2"
												>
													<Image
														src={item.image}
														alt={item.name}
														width={50}
														height={50}
													/>
													{item.name}
												</Link>
											</TableCell>
											<TableCell>
												<span className="px-2">
													{item.qty}
												</span>
											</TableCell>
											<TableCell className="text-right">
												<span className="px-2">
													${item.price}
												</span>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</div>
				<div>
					<Card>
						<CardContent className="p-4 gap-4 space-y-4">
							<div className="flex justify-between">
								<div>Items</div>
								<div>{formatCurrency(itemsPrice)}</div>
							</div>
							<div className="flex justify-between">
								<div>Tax</div>
								<div>{formatCurrency(taxPrice)}</div>
							</div>
							<div className="flex justify-between">
								<div>Shipping</div>
								<div>{formatCurrency(shippingPrice)}</div>
							</div>
							<hr className="my-4 w-full" />
							<div className="flex justify-between">
								<div>Total</div>
								<div>{formatCurrency(totalPrice)}</div>
							</div>
							{/* <PlaceOrderForm /> */}
							{/* PayPal Payment */}
							{!isPaid && paymentMethod === "PayPal" && (
								<div>
									<PayPalScriptProvider
										options={{
											clientId: paypalClientId,
											currency: "CAD",
										}}
									>
										<PrintLoadingState />
										<PayPalButtons
											style={{ layout: "vertical" }}
											createOrder={
												handleCreatePaypalOrder
											}
											onApprove={handleApprovePaypalOrder}
										/>
									</PayPalScriptProvider>
								</div>
							)}

							{/* Stripe Payment */}
							{!isPaid &&
								paymentMethod === "Stripe" &&
								stripeClientSecret && (
									<StripePayment
										priceInCents={
											Number(order.totalPrice) * 100
										}
										clientSecret={stripeClientSecret}
										orderId={id}
										userEmail={order?.user?.email || ""}
									/>
								)}

							{/* COD Payment */}
							{isAdmin &&
								!isPaid &&
								paymentMethod === "CashOnDelivery" && (
									<MarkAsPaidButton />
								)}
							{isAdmin && isPaid && !isDelivered && (
								<MarkAsDeliveredButton />
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
};

export default OrderDetailsTable;
