import { NextResponse } from "next/server";
import { addItemToCart, getMyCart } from "@/lib/actions/cart.actions";

export async function GET() {
	try {
		const cart = await getMyCart();
		return NextResponse.json(cart ?? { items: [] });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: (error as Error).message },
			{ status: 500 }
		);
	}
}
