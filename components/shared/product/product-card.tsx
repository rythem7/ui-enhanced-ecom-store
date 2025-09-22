import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import ProductPrice from "./product-price";
import { Product } from "@/types";
import Rating from "./rating";

const ProductCard = ({ product }: { product: Product }) => {
	return (
		<Card className="w-full  max-w-sm bg-base-100 shadow-md md:hover:shadow-lg md:hover:shadow-accent/40">
			<Link
				href={`/product/${product.slug}`}
				className="h-full flex flex-col justify-between"
			>
				<CardHeader className="p-0 h-2/3 items-center flex-1">
					<Image
						src={product.images[0]}
						alt={product.name}
						height={300}
						width={300}
						className="object-cover h-full w-auto rounded-t-lg opacity-90"
					/>
				</CardHeader>
				<CardContent className="md:p-6 p-4 grid gap-2 md:gap-3">
					{/* <Link href={`/search?brand=${product.brand}`}> */}
					<div className="text-md font-heading">{product.brand}</div>
					{/* </Link> */}
					{/* <Link href={`/product/${product.slug}`}> */}
					<h2 className="text-sm font-medium">{product.name}</h2>
					{/* </Link> */}
					<div className="flex flex-wrap justify-between items-center gap-4">
						<Rating value={Number(product.rating)} />
						{product.stock > 0 ? (
							<ProductPrice value={Number(product.price)} />
						) : (
							<p className="text-destructive">Out Of Stock</p>
						)}
					</div>
				</CardContent>
			</Link>
		</Card>
	);
};

export default ProductCard;
