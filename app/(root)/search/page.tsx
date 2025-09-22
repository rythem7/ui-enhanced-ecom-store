import ProductCard from "@/components/shared/product/product-card";
import {
	getAllProducts,
	getAllCategories,
} from "@/lib/actions/product.actions";
import Link from "next/link";
import {
	PRICE_RANGES,
	RATINGS,
	SORT_OPTIONS,
	ACTIVE_OPTION_CLASS as activeClass,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/shared/pagination";
import { getFilterUrl } from "@/lib/utils";

export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<{
		q: string;
		category: string;
		price: string;
		rating: string;
		brand: string;
	}>;
}) {
	const {
		q = "all",
		category = "all",
		price = "all",
		rating = "all",
		brand = "all",
	} = await searchParams;

	const isQuerySet = q && q !== "all" && q.trim() !== "";
	const isCategorySet =
		category && category !== "all" && category.trim() !== "";
	const isPriceSet = price && price !== "all" && price.trim() !== "";
	const isRatingSet = rating && rating !== "all" && rating.trim() !== "";
	const isBrandSet = brand && brand !== "all" && brand.trim() !== "";

	if (
		!isQuerySet &&
		!isCategorySet &&
		!isPriceSet &&
		!isRatingSet &&
		!isBrandSet
	) {
		return {
			title: "Search Products",
		};
	}

	return {
		title: `Search ${isQuerySet ? `for "${q}"` : ""}${
			isCategorySet ? ` in "${category}"` : ""
		}${isPriceSet ? ` with price "${price}"` : ""}${
			isRatingSet ? ` with rating "${rating} & up"` : ""
		}${isBrandSet ? ` from brand "${brand}"` : ""}`,
	};
}

const SearchPage = async (props: {
	searchParams: Promise<{
		q?: string;
		category?: string;
		price?: string;
		sort?: string;
		page?: string;
		rating?: string;
		brand?: string;
	}>;
}) => {
	const currentParams = await props.searchParams;
	const {
		q = "all",
		category = "all",
		price = "all",
		sort = "newest",
		page = "1",
		rating = "all",
		brand = "all",
	} = currentParams;

	const products = await getAllProducts({
		query: q,
		category,
		price,
		rating,
		limit: 6,
		sort,
		page: Number(page),
		brand,
	});

	const categories = await getAllCategories();
	return (
		<div className="grid md:grid-cols-5 md:gap-5 w-full">
			<div className="filter-links hidden md:block md:col-span-1">
				{/* Category Links */}
				<div className="text-xl mb-2 mt-3 font-heading">Department</div>
				<div className="font-body font-light">
					<ul className="space-y-1">
						<li>
							<Link
								href={getFilterUrl({ c: "all" }, currentParams)}
								className={
									category === "all" || category === ""
										? activeClass
										: ""
								}
							>
								Any
							</Link>
						</li>
						{categories.map((x) => (
							<li key={x.category}>
								<Link
									href={getFilterUrl(
										{ c: x.category },
										currentParams
									)}
									className={
										x.category === category
											? activeClass
											: ""
									}
								>
									{x.category}
								</Link>
							</li>
						))}
					</ul>
				</div>
				{/* Price Links */}
				<div className="text-xl mb-2 mt-8">Price</div>
				<div>
					<ul className="space-y-1">
						<li>
							<Link
								href={getFilterUrl({ p: "all" }, currentParams)}
								className={price === "all" ? activeClass : ""}
							>
								Any
							</Link>
						</li>
						{PRICE_RANGES.map((p) => (
							<li key={p.value}>
								<Link
									href={getFilterUrl(
										{ p: p.value },
										currentParams
									)}
									className={
										p.value === price ? activeClass : ""
									}
								>
									{p.name}
								</Link>
							</li>
						))}
					</ul>
				</div>

				{/* Ratings Links */}
				<div className="text-xl mb-2 mt-8">Customer Ratings</div>
				<div>
					<ul className="space-y-1">
						<li>
							<Link
								href={getFilterUrl({ r: "all" }, currentParams)}
								className={rating === "all" ? activeClass : ""}
							>
								Any
							</Link>
						</li>
						{RATINGS.map((r) => (
							<li key={r}>
								<Link
									href={getFilterUrl(
										{ r: r.toString() },
										currentParams
									)}
									className={
										r.toString() === rating
											? activeClass
											: ""
									}
								>
									{r} Star{r > 1 ? "s" : ""} &amp; Up
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
			<div className="md:col-span-4 space-y-4">
				<div className="flex justify-between flex-col md:flex-row my-4">
					<div className="flex items-center">
						{q !== "all" && q !== "" && 'Query: "' + q + '"'}{" "}
						{category !== "all" &&
							category !== "" &&
							'Category: "' + category + '"'}{" "}
						{price !== "all" &&
							price !== "" &&
							'Price: "' + price + '"'}{" "}
						{rating !== "all" &&
							rating !== "" &&
							'Rating: "' + rating + ' & up"'}
						&nbsp;
						{(q !== "all" && q !== "") ||
						(category !== "all" && category !== "") ||
						(price !== "all" && price !== "") ||
						(rating !== "all" && rating !== "") ? (
							<Button variant="link" asChild>
								<Link href="/search">Clear Filters</Link>
							</Button>
						) : null}
					</div>
					<div className="max-w-md text-2xs mb-2 flex items-center gap-4">
						<div className="font-bold">Sort by:</div>
						<div className="grid grid-cols-2 gap-1">
							{SORT_OPTIONS.map((s) => (
								<Link
									key={s.value}
									href={getFilterUrl({ s: s.value })}
									className={`${
										s.value === sort && activeClass
									}`}
								>
									{s.name}
								</Link>
							))}
						</div>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
					{products.data.length === 0 && <div>No Products Found</div>}
					{products.data.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
				{products.totalPages > 1 && (
					<Pagination page={page} totalPages={products.totalPages} />
				)}
			</div>
		</div>
	);
};

export default SearchPage;
