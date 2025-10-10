import CartTableClient from "./cart-table";
import { Suspense } from "react";

export const metadata = {
	title: "Cart",
};

const CartPage = () => {
	return (
		<>
			<h1 className="py-4 font-heading font-medium text-2xl lg:text-3xl">
				Shopping Cart
			</h1>
			<Suspense fallback={<div>Loading...</div>}>
				<CartTableClient />
			</Suspense>
		</>
	);
};

export default CartPage;
