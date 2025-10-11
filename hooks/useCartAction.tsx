// import { useTransition } from "react";
import { toast } from "sonner";
// import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { GetCart, CartItem } from "@/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useCartAction() {
	const queryClient = useQueryClient();

	const addItemMutation = useMutation({
		mutationFn: async (item: CartItem) => {
			const { data } = await axios.post("/api/cart", item);
			return data;
		},
		// onSuccess: (data) => {
		// 	if (data.success) {
		// 		toast.success(data.message, { duration: 3000 });
		// 		// queryClient.invalidateQueries({ queryKey: ["cart"] });
		// 	} else {
		// 		toast.error(data.message);
		// 	}
		// },

		// Optimistic update
		onMutate: async (newItem) => {
			await queryClient.cancelQueries({ queryKey: ["cart"] });

			const previousCart = queryClient.getQueryData<GetCart>(["cart"]);

			if (previousCart) {
				const existingItem = previousCart.items.find(
					(i) => i.productId === newItem.productId
				);

				let updatedItems;
				if (existingItem) {
					updatedItems = previousCart.items.map((i) =>
						i.productId === newItem.productId
							? { ...i, qty: i.qty + 1 }
							: i
					);
				} else {
					updatedItems = [...previousCart.items, newItem];
				}

				queryClient.setQueryData<GetCart>(["cart"], {
					...previousCart,
					items: updatedItems,
				});
			}

			return { previousCart };
		},

		onError: (err, _newItem, context) => {
			queryClient.setQueryData(["cart"], context?.previousCart);
			toast.error(err?.message || "An error occurred");
		},

		onSuccess: (data) => {
			toast.success(data.message || "Item added!");
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
	});

	const removeItemMutation = useMutation({
		mutationFn: async (productId: string) => {
			const { data } = await axios.delete(
				`/api/cart?productId=${productId}`
			);
			return data;
		},
		onMutate: async (productId) => {
			await queryClient.cancelQueries({ queryKey: ["cart"] });
			const previousCart = queryClient.getQueryData<GetCart>(["cart"]);

			if (previousCart) {
				// const updatedItems = previousCart.items.filter(
				// 	(i) => i.productId !== productId
				// );
				const updatedItems = previousCart.items
					.map((item) => {
						if (item.productId === productId) {
							if (item.qty > 1)
								return { ...item, qty: item.qty - 1 };

							return null; // Remove item if qty is 1
						}
						return item;
					})
					.filter(Boolean) as CartItem[]; // Filter out null values

				queryClient.setQueryData<GetCart>(["cart"], {
					...previousCart,
					items: updatedItems,
				});
			}

			return { previousCart };
		},
		onSuccess: (data) => {
			toast.success(data.message, { duration: 3000 });
		},
		// onError: (error) => {
		// 	toast.error(error?.message || "Failed to remove item from cart.");
		// },
		onError: (err, _productId, context) => {
			queryClient.setQueryData(["cart"], context?.previousCart);
			toast.error(err?.message || "Failed to remove item from cart.");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
	});

	return { addItemMutation, removeItemMutation };
}

// export function useCartAction() {
// 	const [isPending, startTransition] = useTransition();

// 	const performAction = (action: "add" | "remove", payload: CartItem | string) => {
// 		startTransition(async () => {
// 			const res =
// 				action === "add" && typeof payload === "object"
// 					? await addItemToCart(payload)
// 					: await removeItemFromCart(payload as string);

// 			if (!res.success) {
// 				toast.error(res.message);
// 				return;
// 			}

// 			toast.success(res.message, { duration: 3000 });
// 		});
// 	};

// 	return { isPending, performAction };
// }
