"use client";

import type { ReviewType } from "@/types";
import Link from "next/link";
import useSWR from "swr";
import ReviewForm from "./review-form";
import { getReviews } from "@/lib/actions/review.actions";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Rating from "@/components/shared/product/rating";
import { Calendar, User } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function ReviewList({
	userId,
	productId,
	productSlug,
}: {
	userId: string;
	productId: string;
	productSlug: string;
}) {
	const {
		data: reviews,
		isLoading,
		error,
		mutate,
	} = useSWR<ReviewType[]>(
		["reviews", productId],
		() => getReviews({ productId }).then((res) => res.data),
		{ revalidateOnFocus: false, dedupingInterval: 60000 }
	);

	if (error) {
		return <p>Error loading reviews</p>;
	}
	return (
		<div className="space-y-4">
			{userId ? (
				<ReviewForm
					userId={userId}
					productId={productId}
					onReviewSubmitted={() => mutate()}
				/>
			) : (
				<div>
					Please{" "}
					<Link href={`/sign-in?callbackUrl=/product/${productSlug}`}>
						sign in
					</Link>{" "}
					to leave a review.
				</div>
			)}
			<div className="flex flex-col gap-3">
				{isLoading ? (
					<p>Loading reviews...</p>
				) : !reviews || reviews.length === 0 ? (
					<p>No reviews yet.</p>
				) : (
					reviews.map((review) => (
						<Card key={review.id}>
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle>{review.title}</CardTitle>
								</div>
								<CardDescription>
									{review.description}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex-space-x-4 text-sm text-muted-foreground">
									<Rating value={review.rating} />
									<div className="flex items-center">
										<User className="mr-1 h-3 w-3" />
										{review.user?.name ?? "User"}
									</div>
									<div className="flex items-center">
										<Calendar className="mr-1 h-3 w-3" />
										{
											formatDateTime(review.createdAt)
												.dateTime
										}
									</div>
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>
		</div>
	);
}
