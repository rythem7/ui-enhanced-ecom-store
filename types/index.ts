// Import Zod for schema-based type inference
import * as z from "zod";
// Import the product validation schema
import {
	insertProductSchema,
	insertCartSchema,
	cartItemSchema,
	shippingAddressSchema,
	insertOrderItemSchema,
	insertOrderSchema,
	paymentResultSchema,
	insertReviewSchema,
} from "@/lib/validators";

/**
 * Product type definition
 *
 * We use z.infer<typeof insertProductSchema> to automatically generate
 * a TypeScript type from our Zod validation schema. This keeps our types
 * and validation rules in sync, so any change to the schema updates the type.
 *
 * The extra fields (id, rating, createdAt) are added here because they exist
 * in the database but are not part of the insert schema (which is for new products).
 */
export type Product = z.infer<typeof insertProductSchema> & {
	id: string; // Unique product ID from the database
	rating: string; // Product rating (stored as string)
	createdAt: Date; // Timestamp when product was created
	numReviews: number; // Number of reviews for the product
};

export type Cart = z.infer<typeof insertCartSchema>;
export type GetCart = Cart & { id: string };
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
	id: string; // Unique order ID from the database
	createdAt: Date; // Timestamp when order was created
	isPaid: boolean; // Payment status of the order
	paidAt: Date | null; // Timestamp when order was paid
	isDelivered: boolean; // Delivery status of the order
	deliveredAt: Date | null; // Timestamp when order was delivered
	orderitems: OrderItem[]; // List of items in the order
	user: { name: string; email: string }; // User who placed the order
	paymentResult?: PaymentResult; // Payment result details
};

export type PaymentResult = z.infer<typeof paymentResultSchema>;
export type ReviewType = z.infer<typeof insertReviewSchema> & {
	id: string; // Unique review ID from the database
	createdAt: Date; // Timestamp when review was created
	user?: { name: string }; // User who wrote the review
};
