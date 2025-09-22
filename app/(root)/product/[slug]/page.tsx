import { getProductBySlug } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ProductPrice from "@/components/shared/product/product-price";
import ProductImages from "@/components/shared/product/product-images";
import ProductPageAddToCart from "@/components/shared/product/add-to-cart";
import { getMyCart } from "@/lib/actions/cart.actions";
import { Cart } from "@/types";
import ReviewList from "./review-list";
import { auth } from "@/auth";
import Rating from "@/components/shared/product/rating";

const ProductDetailsPage = async ({ params }: { params: { slug: string } }) => {
	const { slug } = params;

	const [product, cart, session] = await Promise.all([
		getProductBySlug(slug),
		getMyCart() as Promise<Cart>,
		auth(),
	]);

	if (!product) notFound();
	// const product = await getProductBySlug(slug);
	// if (!product) notFound();

	// const cart = (await getMyCart()) as Cart;

	// const session = await auth();
	const userId = session?.user?.id || "";

	return (
		<>
			<section>
				<div className="grid grid-cols-1 md:grid-cols-5">
					{/* Images Column */}
					<div className="col-span-2">
						<ProductImages images={product.images} />
					</div>

					{/* Details Column */}
					<div className="col-span-2 p-5">
						<div className="flex flex-col gap-6">
							<p>
								{product.brand} {product.category}
							</p>
							<h1 className="font-bold text-xl lg:text-2xl">
								{product.name}
							</h1>
							<Rating value={Number(product.rating)} />
							<p>{product.numReviews} Reviews</p>
							<div className="flex flex-row md:items-center gap-3">
								<ProductPrice
									value={Number(product.price)}
									className="rounded-full bg-success/40 px-5 py-2"
								/>
							</div>
						</div>
						<div className="mt-10">
							<p className="font-semibold">Description</p>
							<p>{product.description}</p>
						</div>
					</div>
					{/* Action column */}
					<div>
						<Card>
							<CardContent className="p-4">
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
											cart={cart}
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
		</>
	);
};

export default ProductDetailsPage;
