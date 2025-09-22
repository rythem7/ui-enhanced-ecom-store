import Link from "next/link";

export function ViewAllProductsButton() {
	return (
		<div className="flex justify-center items-center m-8">
			<button className="px-8 py-4 text-lg btn btn-primary rounded-box font-semibold">
				<Link href="/search">View All Products</Link>
			</button>
		</div>
	);
}
