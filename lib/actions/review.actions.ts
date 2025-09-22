"use server";

import * as z from "zod";
import { insertReviewSchema } from "../validators";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";

export async function createUpdateReview(
	data: z.infer<typeof insertReviewSchema>
) {
	try {
		const session = await auth();
		if (!session)
			throw new Error("You must be signed in to create a review");

		// Validate and store the review
		const review = insertReviewSchema.parse({
			...data,
			userId: session?.user?.id,
		});

		// Get product that is being reviewed
		const product = await prisma.product.findUnique({
			where: { id: review.productId },
		});
		if (!product) throw new Error("Product not found");

		// Check if user has already reviewed this product
		const existingReview = await prisma.review.findFirst({
			where: {
				productId: review.productId,
				userId: review.userId,
			},
		});

		await prisma.$transaction(async (tx) => {
			if (existingReview) {
				// Update existing review
				await tx.review.update({
					where: { id: existingReview.id },
					data: {
						title: review.title,
						description: review.description,
						rating: review.rating,
					},
				});
			} else {
				// Create new review
				await tx.review.create({
					data: review,
				});
			}
			// Get avg rating
			const avgRating = await tx.review.aggregate({
				where: { productId: review.productId },
				_avg: { rating: true },
			});

			// Get number of reviews
			const numReviews = await tx.review.count({
				where: { productId: review.productId },
			});

			// Update product with new avg rating and numReviews
			await tx.product.update({
				where: { id: review.productId },
				data: {
					rating: avgRating._avg.rating || 0,
					numReviews,
				},
			});
		});

		revalidatePath(`/product/${product.slug}`);

		return { success: true, message: "Review submitted successfully" };
	} catch (error) {
		return {
			success: false,
			message: formatError(error) || "Something went wrong",
		};
	}
}

// Get all reviews for a product
export async function getReviews({ productId }: { productId: string }) {
	const data = await prisma.review.findMany({
		where: { productId },
		include: { user: { select: { name: true } } },
		orderBy: { createdAt: "desc" },
	});
	return { data };
}

// Get a review by a user for a product
export async function getReviewByProductId({
	productId,
}: {
	productId: string;
}) {
	const session = await auth();
	if (!session) throw new Error("User is not authenticated");

	const data = await prisma.review.findFirst({
		where: {
			productId,
			userId: session?.user?.id,
		},
		include: { user: { select: { name: true } } },
	});
	return { data };
}
