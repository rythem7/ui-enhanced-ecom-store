import { getProductBySlug } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ProductPrice from "@/components/shared/product/product-price";
import ProductImages from "@/components/shared/product/product-images";
import ProductPageAddToCart from "@/components/shared/product/add-to-cart";
// import { getMyCart } from "@/lib/actions/cart.actions";
// import { Cart } from "@/types";
import ReviewList from "./review-list";
import { auth } from "@/auth";
import Rating from "@/components/shared/product/rating";

const ProductDetailsPage = async ({
	params,
}: {
	params: Promise<{ slug: string }>;
}) => {
	const { slug } = await params;

	const [product, session] = await Promise.all([
		getProductBySlug(slug),
		// getMyCart() as Promise<Cart>,
		auth(),
	]);

	if (!product) notFound();

	const userId = session?.user?.id || "";

	return (
		<div className="md:p-6">
			<section>
				<div className="grid grid-cols-1 md:grid-cols-10 gap-6">
					{/* Images Column */}
					<div className="md:col-span-4 lg:col-span-5">
						<ProductImages images={product.images} />
					</div>

					{/* Details Column */}
					<div className="md:col-span-3">
						<div className="grid grid-cols-2 md:grid-cols-1 gap-4">
							<div className="space-y-4 md:space-y-6">
								<p>
									{product.brand} {product.category}
								</p>
								<h1 className="font-bold text-xl lg:text-2xl">
									{product.name}
								</h1>
							</div>
							<section className="space-y-2 flex flex-col items-end md:items-start">
								<span>
									<Rating value={Number(product.rating)} />
								</span>
								<p>{product.numReviews} Reviews</p>
							</section>
							<div className="flex flex-row md:items-center gap-3">
								<ProductPrice
									value={Number(product.price)}
									className="rounded-full bg-success/30 brightness-125 px-5 py-2"
								/>
							</div>
						</div>
						<div className="mt-10">
							<p className="font-semibold">Description</p>
							<p>{product.description}</p>
						</div>
					</div>
					{/* Action column */}
					<div className="md:col-span-3 lg:col-span-2">
						<Card>
							<CardContent className="w-full p-4 bg-transparent rounded-box">
								<div className="mb-2 flex justify-between gap-2">
									<div>Price</div>
									<div>
										<ProductPrice
											value={Number(product.price)}
										/>
									</div>
								</div>
								<div className="mb-2 flex justify-between">
									<div>Status</div>
									{product.stock > 0 ? (
										<Badge
											variant="outline"
											className="bg-success/10 text-success"
										>
											In Stock
										</Badge>
									) : (
										<Badge variant="destructive">
											Out Of Stock
										</Badge>
									)}
								</div>
								{product.stock > 0 && (
									<div className="flex justify-center items-center">
										<ProductPageAddToCart
											// cart={cart}
											item={{
												productId: product.id,
												name: product.name,
												slug: product.slug,
												price: product.price,
												qty: 1,
												image: product.images![0],
											}}
										/>
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</section>
			<section className="mt-10">
				<h2 className="font-bold font-heading text-2xl lg:text-3xl mb-4">
					Reviews
				</h2>
				<ReviewList
					userId={userId ?? ""}
					productId={product.id ?? ""}
					productSlug={product.slug ?? ""}
				/>
			</section>
		</div>
	);
};

export default ProductDetailsPage;
