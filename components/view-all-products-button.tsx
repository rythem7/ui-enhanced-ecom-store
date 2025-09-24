import Link from "next/link";

export function ViewAllProductsButton() {
	return (
		<div className="pt-8 text-center">
			<button className="px-8 py-4 mx-auto text-lg btn btn-primary rounded-box font-semibold">
				<Link href="/search">View All Products</Link>
			</button>
		</div>
	);
}
