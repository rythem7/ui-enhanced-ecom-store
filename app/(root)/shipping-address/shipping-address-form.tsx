"use client";

import { useTransition } from "react";
import { ShippingAddress } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControllerRenderProps, useForm, SubmitHandler } from "react-hook-form";
import { shippingAddressSchema } from "@/lib/validators";
import { shippingAddressDefaultValues } from "@/lib/constants";
import { z } from "zod";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CancelButtonCheckout } from "@/components/shared/product/add-to-cart";
import { ArrowRight, Loader } from "lucide-react";
import { updateUserAddress } from "@/lib/actions/user.actions";
import Link from "next/link";

// export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const form = useForm<z.infer<typeof shippingAddressSchema>>({
		resolver: zodResolver(shippingAddressSchema),
		defaultValues: address || shippingAddressDefaultValues,
	});

	const handleFormSubmit: SubmitHandler<
		z.infer<typeof shippingAddressSchema>
	> = async (data) => {
		startTransition(async () => {
			const res = await updateUserAddress(data);
			if (!res.success) {
				toast.error(res.message);
				return;
			}

			toast.success(res.message, {
				duration: 3000,
			});
			router.push("/payment-method");
			return;
		});
	};

	return (
		<>
			<div className="max-w-md mx-auto space-y-4">
				<h1 className="font-bold text-2xl lg:text-3xl mt-4">
					Shipping Address
				</h1>
				<p className="text-sm text-muted-foreground">
					Please enter your shipping address below.
				</p>
				<Form {...form}>
					<form
						method="post"
						className="space-y-4"
						onSubmit={form.handleSubmit(handleFormSubmit)}
					>
						<div className="flex flex-col md:flex-row gap-5">
							<FormField
								control={form.control}
								name="fullName"
								render={({
									field,
								}: {
									field: ControllerRenderProps<
										z.infer<typeof shippingAddressSchema>,
										"fullName"
									>;
								}) => (
									<FormItem className="w-full">
										<FormLabel>Full Name</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter full name"
												{...field}
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex flex-col md:flex-row gap-5">
							<FormField
								control={form.control}
								name="streetAddress"
								render={({
									field,
								}: {
									field: ControllerRenderProps<
										z.infer<typeof shippingAddressSchema>,
										"streetAddress"
									>;
								}) => (
									<FormItem className="w-full">
										<FormLabel>Street Address</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter street address"
												{...field}
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex flex-col md:flex-row gap-5">
							<FormField
								control={form.control}
								name="city"
								render={({
									field,
								}: {
									field: ControllerRenderProps<
										z.infer<typeof shippingAddressSchema>,
										"city"
									>;
								}) => (
									<FormItem className="w-full">
										<FormLabel>City</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter City"
												{...field}
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex flex-col md:flex-row gap-5">
							<FormField
								control={form.control}
								name="postalCode"
								render={({
									field,
								}: {
									field: ControllerRenderProps<
										z.infer<typeof shippingAddressSchema>,
										"postalCode"
									>;
								}) => (
									<FormItem className="w-full">
										<FormLabel>Postal Code</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter Postal Code"
												{...field}
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex flex-col md:flex-row gap-5">
							<FormField
								control={form.control}
								name="country"
								render={({
									field,
								}: {
									field: ControllerRenderProps<
										z.infer<typeof shippingAddressSchema>,
										"country"
									>;
								}) => (
									<FormItem className="w-full">
										<FormLabel>Country</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter Country"
												{...field}
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex justify-between gap-2">
							<button
								className="btn btn-primary text-primary-content"
								disabled={isPending}
								type="submit"
							>
								{isPending ? (
									<Loader className="w-4 h-4 animate-spin" />
								) : (
									<ArrowRight className="w-4 h-4" />
								)}{" "}
								Continue
							</button>
							<CancelButtonCheckout />
						</div>
					</form>
				</Form>
			</div>
		</>
	);
};

export default ShippingAddressForm;
