"use client";

import { useState, useEffect } from "react";
import { Cart } from "@/types";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
	TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumberToCurrency } from "@/lib/utils";
import {
	AddButton,
	RemoveButton,
	GoToCheckout,
} from "@/components/shared/product/add-to-cart";
import { ArrowRight } from "lucide-react";

async function fetchCart(): Promise<Cart> {
	const res = await fetch("/api/cart", { cache: "no-store" });
	if (!res.ok) throw new Error("Failed to fetch cart");
	return res.json();
}

export function CartTable({ cart }: { cart?: Cart }) {
	return (
		<>
			{!cart || cart.items.length === 0 ? (
				<div>
					Cart is empty.{" "}
					<Link href={"/"} className="text-primary cursor-pointer">
						Go Shopping{" "}
						<ArrowRight className="w-4 h-4 inline-block" />
					</Link>
				</div>
			) : (
				<div className="grid md:grid-cols-6 gap-3 md:gap-8">
					<div className="overflow-x-auto md:col-span-4">
						<Table>
							<TableHeader>
								<TableRow className="text-lg">
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
								{cart.items.map((item) => (
									<TableRow key={item.slug}>
										<TableCell>
											<Link
												href={`/product/${item.slug}`}
												className="flex items-center"
											>
												<Image
													src={item.image}
													alt={item.name}
													width={50}
													height={50}
												/>
												<span className="px-2 font-body text-lg">
													{item.name}
												</span>
											</Link>
										</TableCell>
										<TableCell className="flex justify-center pt-5 items-center gap-2">
											<RemoveButton
												productId={item.productId}
											/>
											<span>{item.qty}</span>
											<AddButton item={item} />
										</TableCell>
										<TableCell className="text-md md:text-lg text-right">
											{formatNumberToCurrency(item.price)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					<Card className="md:col-span-2">
						<CardContent className="p-4">
							<div className="pb-3 text-lg flex justify-between mb-4">
								<span className="font-light">
									Subtotal (
									{cart.items.reduce((a, c) => a + c.qty, 0)}
									):
								</span>

								<span className="font-medium text-lg md:text-2xl">
									{" "}
									{formatCurrency(cart.itemsPrice)}
								</span>
							</div>
							<GoToCheckout />
						</CardContent>
					</Card>
				</div>
			)}
		</>
	);
}

export default function CartTableClient() {
	const [cart, setCart] = useState<Cart | undefined>(undefined);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCart = async () => {
			try {
				const response = await fetch("/api/cart", {
					cache: "no-store",
				});
				const data = await response.json();
				setCart(data);
			} catch (error) {
				console.error("Error fetching cart:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchCart();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	return <CartTable cart={cart} />;
}
