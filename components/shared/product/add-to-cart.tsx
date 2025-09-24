"use client";

import { Button } from "@/components/ui/button";
import { Plus, Minus, Loader, ArrowRight } from "lucide-react";
import { CartItem } from "@/types";
import { useCartAction } from "@/hooks/useCartAction";
import { useRouter } from "next/navigation";
import { Cart } from "@/types";
import { useTransition } from "react";
import Link from "next/link";

interface CartButtonProps {
	icon: React.ReactNode;
	action: () => void;
	isPending: boolean;
}

export function CartButton({ icon, action, isPending }: CartButtonProps) {
	return (
		<Button
			type="button"
			variant={"outline"}
			onClick={action}
			disabled={isPending}
		>
			{isPending ? <Loader className="w-4 h-4 animate-spin" /> : icon}
		</Button>
	);
}

export default function ProductPageAddToCart({
	item,
	cart,
}: {
	item: CartItem;
	cart?: Cart;
}) {
	const { isPending, performAction } = useCartAction();
	const existingItem =
		cart && cart.items.find((x) => x.productId === item.productId);

	const handleAddToCart = () => {
		performAction("add", item);
	};

	// Check if item exists in cart

	return existingItem ? (
		<div className="flex items-center">
			<RemoveButton productId={item.productId} />
			<span className="px-2">{existingItem.qty}</span>
			<CartButton
				icon={<Plus className="h-4 w-4" />}
				action={handleAddToCart}
				isPending={isPending}
			/>
		</div>
	) : (
		<button
			className="w-full btn text-primary-content bg-primary brightness-85 lg:brightness-70 lg:hover:brightness-85"
			onClick={handleAddToCart}
			disabled={isPending}
		>
			{isPending ? (
				<Loader className="w-4 h-4 animate-spin" />
			) : (
				<Plus className="h-4 w-4" />
			)}
			Add To Cart
		</button>
	);
}

export function AddButton({ item }: { item: CartItem }) {
	const { isPending, performAction } = useCartAction();

	return (
		<CartButton
			icon={<Plus className="w-4 h-4" />}
			action={() => performAction("add", item)}
			isPending={isPending}
		/>
	);
}

export function RemoveButton({ productId }: { productId: string }) {
	const { isPending, performAction } = useCartAction();

	return (
		<CartButton
			icon={<Minus className="w-4 h-4" />}
			action={() => performAction("remove", productId)}
			isPending={isPending}
		/>
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
