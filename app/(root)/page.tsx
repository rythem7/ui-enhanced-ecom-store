export const revalidate = 300;

import ProductList from "@/components/shared/product/product-list";
import ProductCarousel from "@/components/shared/product/product-carousel";
import { ViewAllProductsButton } from "@/components/view-all-products-button";
import {
	getLatestProducts,
	getFeaturedProducts,
} from "@/lib/actions/product.actions";
import IconBoxes from "@/components/icon-boxes";
import DealCountdown from "@/components/deal-countdown";

const HomePage = async () => {
	const latestProducts = await getLatestProducts();
	const featuredProducts = await getFeaturedProducts();
	return (
		<div>
			{Array.isArray(featuredProducts) && featuredProducts.length > 0 && (
				<ProductCarousel data={featuredProducts} />
			)}
			<ProductList
				data={latestProducts}
				title="Newest Arrivals"
				limit={4}
			/>
			<DealCountdown />
			<ViewAllProductsButton />
			<IconBoxes />
		</div>
	);
};

export default HomePage;
