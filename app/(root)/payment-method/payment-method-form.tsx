"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { paymentMethodSchema } from "@/lib/validators";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { ArrowRight, Loader } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateUserPaymentMethod } from "@/lib/actions/user.actions";
import { CancelButtonCheckout } from "@/components/shared/product/add-to-cart";

const PaymentMethodForm = ({
	preferredPaymentMethod,
}: {
	preferredPaymentMethod: string | undefined;
}) => {
	const router = useRouter();

	const form = useForm<z.infer<typeof paymentMethodSchema>>({
		resolver: zodResolver(paymentMethodSchema),
		defaultValues: {
			type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
		},
	});

	const handleFormSubmit = async (
		values: z.infer<typeof paymentMethodSchema>
	) => {
		startTransition(async () => {
			const res = await updateUserPaymentMethod(values);

			if (!res.success) {
				toast.error(res.message);
				return;
			}

			toast.success("Payment method updated successfully.");
			router.push("/place-order");
		});
	};

	const [isPending, startTransition] = useTransition();
	return (
		<>
			<div className="max-w-md mx-auto space-y-4">
				<h1 className="font-bold text-2xl lg:text-3xl mt-4">
					Payment Method
				</h1>
				<p className="text-sm text-muted-foreground">
					Please select a payment method.
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
								name="type"
								render={({ field }) => (
									<FormItem className="space-y-3">
										<FormControl>
											<RadioGroup
												onValueChange={field.onChange}
												className="flex flex-col space-y-2"
											>
												{PAYMENT_METHODS.map(
													(paymentMethod) => (
														<FormItem
															key={paymentMethod}
															className="flex items-center space-x-3 space-y-0"
														>
															<FormLabel className="font-normal">
																{paymentMethod}
															</FormLabel>
															<FormControl>
																<RadioGroupItem
																	value={
																		paymentMethod
																	}
																	checked={
																		field.value ===
																		paymentMethod
																	}
																/>
															</FormControl>

															<FormMessage />
														</FormItem>
													)
												)}
											</RadioGroup>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						{/* {Button actions} */}
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

export default PaymentMethodForm;
