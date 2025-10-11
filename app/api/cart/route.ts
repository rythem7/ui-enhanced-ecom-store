import { NextResponse } from "next/server";
import {
	addItemToCart,
	getMyCart,
	removeItemFromCart,
} from "@/lib/actions/cart.actions";
import { formatError } from "@/lib/utils";

export async function GET() {
	try {
		const cart = await getMyCart();
		return NextResponse.json(cart ?? { items: [] });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: formatError(error) },
			{ status: 500 }
		);
	}
}

// ✅ Add item to cart
export async function POST(req: Request) {
	try {
		const body = await req.json();
		const res = await addItemToCart(body);

		if (!res.success) {
			return NextResponse.json(res);
		}

		return NextResponse.json(res, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: formatError(error) },
			{ status: 500 }
		);
	}
}

// ✅ Remove item from cart
export async function DELETE(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const productId = searchParams.get("productId");

		if (!productId)
			return NextResponse.json(
				{ success: false, message: "Missing productId" },
				{ status: 400 }
			);

		const res = await removeItemFromCart(productId);

		if (!res.success) {
			return NextResponse.json(res);
		}

		return NextResponse.json(res);
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: formatError(error) },
			{ status: 500 }
		);
	}
}
