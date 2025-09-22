"use client";

import { Product } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { productDefaultValues } from "@/lib/constants";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import slugify from "slugify";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";

const ProductForm = ({
	type,
	product,
	productId,
}: {
	type: "Create" | "Update";
	product?: Product;
	productId?: string;
}) => {
	const router = useRouter();

	const form = useForm<z.infer<typeof insertProductSchema>>({
		resolver: zodResolver(
			type === "Create" ? insertProductSchema : updateProductSchema
		),
		defaultValues:
			product && type === "Update" ? product : productDefaultValues,
	});

	const handleSlugify = () => {
		const name = form.getValues("name");
		const slug = slugify(name, { lower: true });
		form.setValue("slug", slug);
	};

	const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
		values
	) => {
		if (type === "Create") {
			// Create product logic
			const res = await createProduct(values);
			if (res.success) {
				toast.success("Product created successfully");
				router.push("/admin/products");
			} else {
				toast.error(res.message || "Something went wrong");
			}
		}
		if (type === "Update") {
			// Update product logic
			if (!productId) {
				router.push("/admin/products");
				return toast.error("Product Id is missing");
			}
			const res = await updateProduct({ id: productId, ...values });
			if (res.success) {
				toast.success("Product updated successfully");
				router.push("/admin/products");
			} else {
				toast.error(res.message || "Something went wrong");
			}
		}
	};

	const images = form.watch("images");
	const isFeatured = form.watch("isFeatured");
	const banner = form.watch("banner");

	return (
		<div>
			<Form {...form}>
				<form
					method="POST"
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8"
				>
					<div className="flex flex-col md:flex-row gap-5">
						{/* Name */}
						<FormField
							control={form.control}
							name="name"
							render={({
								field,
							}: {
								field: ControllerRenderProps<
									z.infer<typeof insertProductSchema>,
									"name"
								>;
							}) => (
								<FormItem className="w-full">
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Product Name"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Slug */}
						<FormField
							control={form.control}
							name="slug"
							render={({
								field,
							}: {
								field: ControllerRenderProps<
									z.infer<typeof insertProductSchema>,
									"slug"
								>;
							}) => (
								<FormItem className="w-full">
									<FormLabel>Slug</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												{...field}
												placeholder="Product Slug"
											/>
											<Button
												type="button"
												className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2"
												onClick={handleSlugify}
											>
												Generate
											</Button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="flex flex-col md:flex-row gap-5">
						{/* Category */}
						<FormField
							control={form.control}
							name="category"
							render={({
								field,
							}: {
								field: ControllerRenderProps<
									z.infer<typeof insertProductSchema>,
									"category"
								>;
							}) => (
								<FormItem className="w-full">
									<FormLabel>Category</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Product Category"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Brand */}
						<FormField
							control={form.control}
							name="brand"
							render={({
								field,
							}: {
								field: ControllerRenderProps<
									z.infer<typeof insertProductSchema>,
									"brand"
								>;
							}) => (
								<FormItem className="w-full">
									<FormLabel>Brand</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Enter Brand"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="flex flex-col md:flex-row gap-5">
						{/* Price */}
						<FormField
							control={form.control}
							name="price"
							render={({
								field,
							}: {
								field: ControllerRenderProps<
									z.infer<typeof insertProductSchema>,
									"price"
								>;
							}) => (
								<FormItem className="w-full">
									<FormLabel>Price</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Product Price"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Stock */}
						<FormField
							control={form.control}
							name="stock"
							render={({
								field,
							}: {
								field: ControllerRenderProps<
									z.infer<typeof insertProductSchema>,
									"stock"
								>;
							}) => (
								<FormItem className="w-full">
									<FormLabel>Stock</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Enter Stock"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="upload-field flex flex-col md:flex-row gap-5">
						{/* Images */}
						<FormField
							control={form.control}
							name="images"
							render={() => (
								<FormItem className="w-full">
									<FormLabel>Images</FormLabel>
									<Card>
										<CardContent className="space-y-2 mt-2 min-h-48">
											<div className="flex justify-start items-center space-x-2">
												{images.length > 0 &&
													images.map(
														(image: string) => (
															<Image
																key={image}
																src={image}
																alt="Product Image"
																width={100}
																height={100}
																className="w-20 h-20 object-cover object-center rounded-sm"
															/>
														)
													)}
												<FormControl>
													<UploadButton
														endpoint={
															"imageUploader"
														}
														onClientUploadComplete={(
															res: {
																url: string;
															}[]
														) => {
															form.setValue(
																"images",
																[
																	...images,
																	res[0].url,
																]
															);
														}}
														onUploadError={(
															error: Error
														) => {
															// Do something with the error.
															toast.error(
																`ERROR! ${error.message}`
															);
														}}
													/>
												</FormControl>
											</div>
										</CardContent>
									</Card>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="upload-field">
						{/* Is Featured */}
						Featured Product
						<Card>
							<CardContent className="space-y-2 mt-2">
								<FormField
									control={form.control}
									name="isFeatured"
									render={({
										field,
									}: {
										field: ControllerRenderProps<
											z.infer<typeof insertProductSchema>,
											"isFeatured"
										>;
									}) => (
										<FormItem className="w-full">
											<FormControl>
												<Checkbox checked={field.value} onCheckedChange={field.onChange} />
											</FormControl>
											<FormLabel>Is Featured?</FormLabel>
											<FormMessage />
										</FormItem>
									)}
								/>
								{isFeatured && banner && (
									<Image
										src={banner}
										alt="banner image"
										width={1920}
										height={680}
										className="w-full object-cover object-center rounded-sm"
									/>
								)}

								{isFeatured && !banner && (
									<UploadButton
										endpoint={
											"imageUploader"
										}
										onClientUploadComplete={(
											res: {
												url: string;
											}[]
										) => {
											form.setValue("banner", res[0].url);
										}}
										onUploadError={(
											error: Error
										) => {
											// Do something with the error.
											toast.error(
												`ERROR! ${error.message}`
											);
										}}
									/>
								)}
							</CardContent>
						</Card>
					</div>
					<div className="upload-field">
						{/* Description */}
						<FormField
							control={form.control}
							name="description"
							render={({
								field,
							}: {
								field: ControllerRenderProps<
									z.infer<typeof insertProductSchema>,
									"description"
								>;
							}) => (
								<FormItem className="w-full">
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											placeholder="Product Description"
											className="resize-none h-32"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div>
						{/* Submit */}
						<Button
							type="submit"
							size={"lg"}
							className="w-full"
							disabled={form.formState.isSubmitting}
						>
							{form.formState.isSubmitting
								? "Submitting..."
								: `${type} Product`}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default ProductForm;
