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
			<div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
				<h2 className="text-2xl py-4 col-span-2 md:col-span-3">
					Order {formatId(id)}
				</h2>
				<div className="space-y-4 col-span-2 overflow-x-auto">
					<Card>
						<CardContent className="p-4 gap-4 bg-base-200 rounded-box flex flex-col">
							<h2 className="text-xl">Payment Method</h2>
							<section className="flex justify-between items-center">
								<p className="mb-2">{paymentMethod}</p>
								{isPaid ? (
									<Badge className="bg-success text-success-content rounded-full font-medium">
										Paid at{" "}
										{formatDateTime(paidAt!).dateTime}
									</Badge>
								) : (
									<Badge className="bg-error text-error-content rounded-full font-medium">
										Not paid
									</Badge>
								)}
							</section>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4 gap-4 bg-base-200 rounded-box ">
							<h2 className="text-xl pb-4">Shipping Address</h2>
							<div className="flex justify-between items-center">
								<section>
									<p>{shippingAddress.fullName}</p>
									<p>
										{shippingAddress.streetAddress},{" "}
										{shippingAddress.city}
									</p>
									<p className="mb-2">
										{shippingAddress.postalCode},{" "}
										{shippingAddress.country}
									</p>
								</section>
								{isDelivered ? (
									<Badge className="bg-success text-success-content rounded-full font-medium">
										Delivered at{" "}
										{formatDateTime(deliveredAt!).dateTime}
									</Badge>
								) : (
									<Badge className="bg-error text-error-content rounded-full font-medium">
										Not delivered
									</Badge>
								)}
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4 gap-4 bg-base-200 rounded-box">
							<h2 className="text-xl pb-4">Order Items</h2>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Item</TableHead>
										<TableHead className="text-center">
											Quantity
										</TableHead>
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
											<TableCell className="text-center">
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
				<div className="col-span-2 md:col-span-1">
					<Card>
						<CardContent className="p-4 gap-4 space-y-4 bg-base-200 rounded-box">
							<div className="flex justify-between">
								<section>Items</section>
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

							{/* COD / Delivery Actions */}
							{isAdmin && (
								<div className="text-right">
									{!isPaid &&
										paymentMethod === "CashOnDelivery" && (
											<MarkAsPaidButton />
										)}

									{isPaid && !isDelivered && (
										<MarkAsDeliveredButton />
									)}
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
};

export default OrderDetailsTable;
