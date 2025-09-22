"use client";

import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { insertReviewSchema } from "@/lib/validators";
import {
	createUpdateReview,
	getReviewByProductId,
} from "@/lib/actions/review.actions";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { reviewDefaultValues } from "@/lib/constants";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { StarIcon } from "lucide-react";

const ReviewForm = ({
	userId,
	productId,
	onReviewSubmitted,
}: {
	userId: string;
	productId: string;
	onReviewSubmitted: () => void;
}) => {
	const [open, setOpen] = useState(false);

	const form = useForm<z.infer<typeof insertReviewSchema>>({
		resolver: zodResolver(insertReviewSchema),
		defaultValues: reviewDefaultValues,
	});

	// Open Form Handler
	const handleFormOpen = async () => {
		form.setValue("productId", productId);
		form.setValue("userId", userId);

		const review = await getReviewByProductId({ productId });
		if (review) {
			form.setValue("title", review?.data?.title || "");
			form.setValue("description", review?.data?.description || "");
			form.setValue("rating", review?.data?.rating || 0);
		}
		setOpen(true);
	};

	// Form Submit Handler
	const onSubmit: SubmitHandler<z.infer<typeof insertReviewSchema>> = async (
		values
	) => {
		const result = await createUpdateReview({
			...values,
			productId,
		});
		if (!result.success) {
			toast.error(result.message || "Failed to submit review");
		}
		form.reset();
		setOpen(false);
		onReviewSubmitted();
		toast.success(result.message);
	};
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<button
					onClick={handleFormOpen}
					className="btn btn-primary text-primary-content font-light"
				>
					Write a Review
				</button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg bg-base-300 text-base-content">
				<Form {...form}>
					<form method="post" onSubmit={form.handleSubmit(onSubmit)}>
						<DialogHeader>
							<DialogTitle className="font-heading font-medium">
								Write a Review
							</DialogTitle>
							<DialogDescription className="text-sm text-base-content/70">
								Share your thoughts about the product
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input
												placeholder="Review title"
												className="bg-base-200"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Review description"
												className="bg-base-200"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="rating"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Rating</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value.toString()}
										>
											<FormControl>
												<SelectTrigger className="bg-base-200">
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent className="bg-base-200">
												{[1, 2, 3, 4, 5].map(
													(rating) => (
														<SelectItem
															key={rating}
															value={rating.toString()}
														>
															{rating}{" "}
															<StarIcon className="h-4 w-4 inline" />
														</SelectItem>
													)
												)}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<button
								type="submit"
								className={cn("btn btn-lg w-full")}
								disabled={form.formState.isSubmitting}
							>
								{form.formState.isSubmitting
									? "Submitting..."
									: "Submit Review"}
							</button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default ReviewForm;
