import { Cart } from "@/types";
import CartTable from "./cart-table";
import { getMyCart } from "@/lib/actions/cart.actions";
import { Suspense } from "react";

export const metadata = {
	title: "Cart",
};

const CartTableWrapper = async () => {
	const cart = (await getMyCart()) as Cart | undefined;
	return <CartTable cart={cart} />;
};

const CartPage = () => {
	return (
		<>
			<h1 className="py-4 font-heading font-medium text-2xl lg:text-3xl">
				Shopping Cart
			</h1>
			<Suspense fallback={<div>Loading...</div>}>
				<CartTableWrapper />
			</Suspense>
		</>
	);
};

export default CartPage;
