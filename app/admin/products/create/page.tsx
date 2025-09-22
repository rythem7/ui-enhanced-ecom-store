import { requireAdmin } from "@/lib/auth-guard";
import { Metadata } from "next";
import ProductForm from "@/components/admin/product-form";

export const metadata: Metadata = {
	title: "Create Product",
};

const CreateProductsPage = async () => {
	await requireAdmin();
	return (
		<>
			<h1>Create Product</h1>
			<div className="my-8">
				<ProductForm type="Create" />
			</div>
		</>
	);
};

export default CreateProductsPage;
