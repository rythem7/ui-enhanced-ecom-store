import { useTransition } from "react";
import { toast } from "sonner";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { CartItem } from "@/types";

type CartAction = "add" | "remove";

export function useCartAction() {
	const [isPending, startTransition] = useTransition();

	const performAction = (action: CartAction, payload: CartItem | string) => {
		startTransition(async () => {
			const res =
				action === "add" && typeof payload === "object"
					? await addItemToCart(payload)
					: await removeItemFromCart(payload as string);

			if (!res.success) {
				toast.error(res.message);
				return;
			}

			toast.success(res.message, { duration: 3000 });
		});
	};

	return { isPending, performAction };
}
