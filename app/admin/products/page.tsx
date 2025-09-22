import { requireAdmin } from "@/lib/auth-guard";
import { getAllProducts, deleteProduct } from "@/lib/actions/product.actions";
import { formatCurrency, formatId } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/shared/pagination";
import DeleteDialog from "@/components/shared/delete-dialog";

const AdminProductsPage = async (props: {
	searchParams: Promise<{
		page: string;
		query: string;
		category: string;
	}>;
}) => {
	await requireAdmin();
	const searchParams = await props.searchParams;

	const page = Number(searchParams.page) || 1;
	const query = searchParams.query || "";
	const category = searchParams.category || "";

	const products = await getAllProducts({
		page,
		limit: 12,
		query,
		category,
	});

	return (
		<div className="space-y-2">
			<div className="flex justify-between items-center">
				<div className="flex items-center gap-3">
					<h1 className="font-bold text-2xl lg:text-3xl">Products</h1>
					{query && (
						<div>
							Filtered by <i>&quot;{query}&quot;</i>{" "}
							<Link href={`/admin/products`}>
								<Button variant={"outline"} size={"sm"}>
									Remove Filter
								</Button>
							</Link>
						</div>
					)}
				</div>

				<Button asChild variant={"default"}>
					<Link href="/admin/products/create">Add Product</Link>
				</Button>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>NAME</TableHead>
						<TableHead className="text-center">PRICE</TableHead>
						<TableHead className="text-center">CATEGORY</TableHead>
						<TableHead>STOCK</TableHead>
						<TableHead>RATINGS</TableHead>
						<TableHead className="w-[100px] text-center">
							ACTIONS
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{products.data.map((product) => (
						<TableRow key={product.id}>
							<TableCell className="font-medium">
								{formatId(product.id)}
							</TableCell>
							<TableCell>{product.name}</TableCell>
							<TableCell className="text-right">
								{formatCurrency(product.price)}
							</TableCell>
							<TableCell className="text-center">
								{product.category}
							</TableCell>
							<TableCell className="text-center">
								{product.stock}
							</TableCell>
							<TableCell className="text-center">
								{product.rating}
							</TableCell>
							<TableCell className="flex flex-row gap-1">
								<Link href={`/admin/products/${product.id}`}>
									<Button variant={"outline"} size={"sm"}>
										Edit
									</Button>
								</Link>
								<DeleteDialog
									id={product.id}
									action={deleteProduct}
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			{products.totalPages > 1 && (
				<Pagination page={page} totalPages={products.totalPages} />
			)}
		</div>
	);
};

export default AdminProductsPage;
