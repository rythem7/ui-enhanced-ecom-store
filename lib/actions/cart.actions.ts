"use server";

import { CartItem, GetCart } from "@/types";
import { cookies } from "next/headers";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "../generated/prisma";

const calcPrice = (items: CartItem[]) => {
	const itemsPrice = round2(
		items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
	);
	const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
	const taxPrice = round2(0.15 * itemsPrice);
	const totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

	return {
		itemsPrice: itemsPrice.toFixed(2),
		shippingPrice: shippingPrice.toFixed(2),
		taxPrice: taxPrice.toFixed(2),
		totalPrice: totalPrice.toFixed(2),
	};
};

export async function addItemToCart(data: CartItem) {
	try {
		// Check for cart cookie
		const sessionCartId = (await cookies()).get("sessionCartId")?.value;
		if (!sessionCartId) throw new Error("Cart Session not found");

		// get the session and user ID
		const session = await auth();
		const userId =
			session?.user?.id ? (session.user.id as string) : undefined;

		// Get cart
		const cart = (await getMyCart()) as GetCart | null;

		// Parse and validate item
		const item = cartItemSchema.parse(data);

		// Find Product in database
		const product = await prisma.product.findFirst({
			where: { id: item.productId },
		});

		if (!product) throw new Error("Product Not Found");

		if (!cart) {
			const newCart = insertCartSchema.parse({
				userId,
				items: [item],
				sessionCartId,
				...calcPrice([item]),
			});

			// Add to database
			await prisma.cart.create({
				data: newCart,
			});

			// Revalidate Product Page
			revalidatePath(`/product/${product.slug}`);

			return {
				success: true,
				message: `${product.name} added to cart`,
			};
		} else {
			// Check if item is already in the cart
			const existingItem = cart.items.find(
				(cartItem) => cartItem.productId === item.productId
			);

			if (existingItem) {
				// Check Stock
				if (product.stock < existingItem.qty + 1) {
					throw new Error("Not Enough Stock");
				}

				existingItem.qty += 1;
			} else {
				// If item is not in cart
				// Check Stock
				if (product.stock < 1) throw new Error("Not enough Stock");

				// Add item to the cart.items
				cart.items.push(item);
			}

			// Save to database
			await prisma.cart.update({
				where: { id: cart.id },
				data: {
					items: cart.items as Prisma.CartUpdateitemsInput[],
					...calcPrice(cart.items as CartItem[]),
				},
			});

			revalidatePath(`/product/${product.slug}`);
			return {
				success: true,
				message: `${product.name} ${
					existingItem ? "updated in" : "added to"
				} cart`,
			};
		}
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

export async function getMyCart() {
	// Check for cart cookie
	const sessionCartId = (await cookies()).get("sessionCartId")?.value;
	if (!sessionCartId) throw new Error("Cart Session not found");

	// get the session and user ID
	const session = await auth();
	const userId = session?.user?.id ? (session.user.id as string) : undefined;

	// Get user cart from database
	const cart = await prisma.cart.findFirst({
		where: userId ? { userId } : { sessionCartId },
	});

	if (cart) {
		return convertToPlainObject({
			...cart,
			items: cart.items as CartItem[],
			itemsPrice: cart.itemsPrice.toString(),
			totalPrice: cart.totalPrice.toString(),
			shippingPrice: cart.shippingPrice.toString(),
			taxPrice: cart.taxPrice.toString(),
		});
	}
}

export async function removeItemFromCart(productId: string) {
	try {
		// Check for cart cookie
		const sessionCartId = (await cookies()).get("sessionCartId")?.value;
		if (!sessionCartId) throw new Error("Cart Session not found");

		// Get Product
		const product = await prisma.product.findFirst({
			where: { id: productId },
		});
		if (!product) throw new Error("Product Not Found");

		// Get user cart
		const cart = (await getMyCart()) as GetCart | null;
		if (!cart) throw new Error("Cart Not Found");

		// Check for item
		const existingItem = cart.items.find((x) => x.productId === productId);
		if (!existingItem) throw new Error("Item not found in cart");

		// Check if only 1 in qty
		if (existingItem.qty === 1) {
			// Remove from Cart
			cart.items = cart.items.filter(
				(x) => x.productId !== existingItem.productId
			);
		} else {
			// Decrease qty by 1
			existingItem.qty -= 1;
		}

		// Update cart in database
		await prisma.cart.update({
			where: { id: cart.id },
			data: {
				items: cart.items as Prisma.CartUpdateitemsInput[],
				...calcPrice(cart.items as CartItem[]),
			},
		});

		revalidatePath(`/product/${product.slug}`);
		return {
			success: true,
			message: `${product.name} was removed from cart`,
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}
