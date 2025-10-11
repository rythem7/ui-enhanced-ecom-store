"use client";

import { Button } from "@/components/ui/button";
import { Plus, Minus, Loader, ArrowRight } from "lucide-react";
import { CartItem } from "@/types";
import { useCartAction } from "@/hooks/useCartAction";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";

// interface CartButtonProps {
// 	icon: React.ReactNode;
// 	action: () => void;
// 	isPending: boolean;
// }

// export function CartButton({ icon, action, isPending }: CartButtonProps) {
// 	return (
// 		<Button
// 			type="button"
// 			variant={"outline"}
// 			onClick={action}
// 			disabled={isPending}
// 		>
// 			{isPending ? <Loader className="w-4 h-4 animate-spin" /> : icon}
// 		</Button>
// 	);
// }

export default function ProductPageAddToCart({ item }: { item: CartItem }) {
	const { data: cart } = useCart();
	const { addItemMutation } = useCartAction();

	const existingItem = cart?.items.find(
		(x) => x.productId === item.productId
	);

	const handleAddToCart = () => {
		addItemMutation.mutate(item);
	};

	// Check if item exists in cart
	return existingItem ? (
		<div className="flex items-center">
			<RemoveButton productId={item.productId} />
			<span className="px-2">{existingItem.qty}</span>
			<AddButton item={item} />
		</div>
	) : (
		<Button
			type="button"
			onClick={handleAddToCart}
			disabled={addItemMutation.isPending}
		>
			{addItemMutation.isPending ? (
				<Loader className="w-4 h-4 animate-spin" />
			) : (
				"Add to Cart"
			)}
		</Button>
	);
}

export function AddButton({ item }: { item: CartItem }) {
	const { addItemMutation } = useCartAction();

	return (
		<Button
			type="button"
			variant={"outline"}
			onClick={() => addItemMutation.mutate(item)}
			disabled={addItemMutation.isPending}
		>
			{addItemMutation.isPending ? (
				<Loader className="w-4 h-4 animate-spin" />
			) : (
				<Plus className="h-4 w-4" />
			)}
		</Button>
	);
}

export function RemoveButton({ productId }: { productId: string }) {
	const { removeItemMutation } = useCartAction();

	return (
		<Button
			type="button"
			variant={"outline"}
			onClick={() => removeItemMutation.mutate(productId)}
			disabled={removeItemMutation.isPending}
		>
			{removeItemMutation.isPending ? (
				<Loader className="w-4 h-4 animate-spin" />
			) : (
				<Minus className="h-4 w-4" />
			)}
		</Button>
	);
}

export function GoToCheckout() {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	return (
		<button
			className="w-full cursor-pointer bg-primary text-primary-content px-4 py-1 rounded-md flex items-center justify-center"
			onClick={() =>
				startTransition(() => router.push("/shipping-address"))
			}
			disabled={isPending}
		>
			{isPending ? (
				<Loader className="w-4 h-4 animate-spin" />
			) : (
				<ArrowRight className="h-4 w-4" />
			)}{" "}
			Go To Checkout
		</button>
	);
}

export function CancelButtonCheckout() {
	return (
		<button className="rounded-lg hover:ring-error hover:ring-1 px-4">
			<Link href="/cart">Cancel</Link>
		</button>
	);
}
