import * as z from "zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";

const currency = z
	.string()
	.refine(
		(v) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(v))),
		"Price must have exactly two decimal places"
	);

// Schema for inserting Products
export const insertProductSchema = z.object({
	name: z.string().min(3, "Name must be atleast 3 characters"),
	slug: z.string().min(3, "Slug must be atleast 3 characters"),
	category: z.string().min(3, "Category must be atleast 3 characters"),
	brand: z.string().min(3, "Brand must be atleast 3 characters"),
	description: z.string().min(3, "Description must be atleast 3 characters"),
	stock: z.coerce.number<number>(),
	images: z.array(z.string()).min(1, "Product must have atleast one image"),
	isFeatured: z.boolean().optional(),
	banner: z.string().nullable(),
	price: currency,
});

// Schema for updating product
export const updateProductSchema = insertProductSchema.extend({
	id: z.string().min(1, "Product Id is required"),
});

export const signInFormSchema = z.object({
	email: z.email("Invalid Email Address"),
	password: z.string().min(6, "Password must be atleast 6 characters"),
});

export const signUpFormSchema = z
	.object({
		name: z.string().min(3, "Name must be at least 3 characters"),
		email: z.string().email("Invalid Email Address"),
		password: z.string().min(6, "Password must be atleast 6 characters"),
		confirmPassword: z
			.string()
			.min(6, "Confirm Password must be atleast 6 characters"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export const cartItemSchema = z.object({
	productId: z.string().min(1, "Product Id is required"),
	name: z.string().min(1, "Product Name is required"),
	slug: z.string().min(1, "Slug is required"),
	qty: z.number().int().nonnegative("Quantity must be a positive number"),
	image: z.string().min(1, "Image is required"),
	price: currency,
});

export const insertCartSchema = z.object({
	items: z.array(cartItemSchema),
	itemsPrice: currency,
	totalPrice: currency,
	shippingPrice: currency,
	taxPrice: currency,
	sessionCartId: z.string().min(1, "Session cart id is required"),
	userId: z.string().optional().nullable(),
});

// Schema for shipping address
export const shippingAddressSchema = z.object({
	fullName: z.string().min(3, "Name must be atleast 3 characters"),
	streetAddress: z.string().min(3, "Address must be atleast 3 characters"),
	city: z.string().min(3, "City must be atleast 3 characters"),
	postalCode: z.string().min(4, "Postal Code must be atleast 4 characters"),
	country: z.string().min(3, "Country Name must be atleast 3 characters"),
	lat: z.number().optional(),
	lng: z.number().optional(),
});

// Schema for payment method
export const paymentMethodSchema = z
	.object({
		type: z.string().min(1, "Payment Method is required"),
	})
	.refine((val) => PAYMENT_METHODS.includes(val.type), {
		path: ["type"],
		message: "Invalid Payment Method",
	});

// Schema for inserting order
export const insertOrderSchema = z.object({
	userId: z.string().min(1, "User is required"),
	shippingAddress: shippingAddressSchema,
	paymentMethod: z.string().refine((val) => PAYMENT_METHODS.includes(val), {
		message: "Invalid Payment Method",
	}),
	itemsPrice: currency,
	shippingPrice: currency,
	taxPrice: currency,
	totalPrice: currency,
});

// Schema for inserting order item
export const insertOrderItemSchema = z.object({
	orderId: z.string().min(1, "Order Id is required"),
	productId: z.string().min(1, "Product Id is required"),
	name: z.string().min(1, "Product Name is required"),
	slug: z.string().min(1, "Slug is required"),
	qty: z.number().int().nonnegative("Quantity must be a positive number"),
	image: z.string().min(1, "Image is required"),
	price: currency,
});

export const paymentResultSchema = z.object({
	id: z.string(),
	status: z.string(),
	email_address: z.string(),
	pricePaid: z.string(),
});

// Schema to update user profile
export const userProfileSchema = z.object({
	name: z.string().min(3, "Name must be atleast 3 characters"),
	email: z.string().min(5, "Email must be atleast 5 characters"),
});

// Schema to update users (by admin)
export const updateUserSchema = userProfileSchema.extend({
	id: z.string().min(1, "User Id is required"),
	role: z.string().min(1, "Role is required"),
});

// Schema to insert review
export const insertReviewSchema = z.object({
	title: z.string().min(3, "Title is required"),
	productId: z.string().min(3, "Product Id is required"),
	userId: z.string().min(3, "User Id is required"),
	rating: z.coerce
		.number<number>()
		.int()
		.min(1, "Rating must be at least 1")
		.max(5),
	description: z.string().min(3, "Description is required"),
});
