"use server";

import {
	signInFormSchema,
	signUpFormSchema,
	paymentMethodSchema,
	updateUserSchema,
} from "../validators";
import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { GetCart, ShippingAddress } from "@/types";
import * as z from "zod";
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { Prisma } from "../generated/prisma";
import { getMyCart } from "./cart.actions";

// Define PaymentMethod
type PaymentMethod = z.infer<typeof paymentMethodSchema>;

// Sign in the user with credentials
export async function signInWithCredentials(
	prevState: unknown,
	formData: FormData
) {
	try {
		const user = signInFormSchema.parse({
			email: formData.get("email"),
			password: formData.get("password"),
		});

		await signIn("credentials", user);

		return { success: true, message: "Signed in successfully" };
	} catch (error) {
		if (isRedirectError(error)) {
			throw error;
		}

		return { success: false, message: "Invalid email or password" };
	}
}

// Sign user out
export async function signOutUser() {
	const currentCart = (await getMyCart()) as GetCart | undefined;
	if (currentCart) {
		await prisma.cart.delete({
			where: { id: currentCart.id },
		});
	}
	await signOut();
}

// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
	try {
		const user = signUpFormSchema.parse({
			name: formData.get("name"),
			email: formData.get("email"),
			password: formData.get("password"),
			confirmPassword: formData.get("confirmPassword"),
		});

		const plainPassword = user.password;
		user.password = hashSync(user.password, 10);

		await prisma.user.create({
			data: {
				name: user.name,
				email: user.email,
				password: user.password,
			},
		});

		await signIn("credentials", {
			email: user.email,
			password: plainPassword,
		});

		return { success: true, message: "User registered successfully" };
	} catch (error) {
		if (isRedirectError(error)) {
			throw error;
		}

		return { success: false, message: formatError(error) };
	}
}

// Get user by the ID
export async function getUserById(userId: string) {
	const user = await prisma.user.findFirst({
		where: { id: userId },
	});
	if (!user) throw new Error("User Not Found");
	return user;
}

// Delete user by ID (admin)
export async function deleteUserById(id: string) {
	try {
		await prisma.user.delete({ where: { id } });

		revalidatePath("/admin/users");

		return { success: true, message: "User deleted successfully" };
	} catch (error) {
		return { success: false, message: formatError(error) as string };
	}
}

// Get all users (for admin)
export async function getAllUsers({
	limit = PAGE_SIZE,
	page,
	query,
}: {
	limit?: number;
	page: number;
	query?: string;
}) {
	const queryFilter: Prisma.UserWhereInput =
		query && query !== "all" ?
			{
				name: {
					contains: query,
					mode: "insensitive",
				} as Prisma.StringFilter,
			}
		:	{};

	const data = await prisma.user.findMany({
		where: { ...queryFilter },
		orderBy: { createdAt: "desc" },
		take: limit,
		skip: (page - 1) * limit,
	});
	const userCount = await prisma.user.count();
	return {
		data,
		totalPages: Math.ceil(userCount / limit),
	};
}

// Update user's shipping address
export async function updateUserAddress(address: ShippingAddress) {
	try {
		const session = await auth();
		const currentUser = await prisma.user.findFirst({
			where: { id: session?.user?.id as string },
		});
		if (!currentUser) throw new Error("User not found");

		await prisma.user.update({
			where: { id: currentUser.id },
			data: { address },
		});
		return { success: true, message: "Address updated successfully" };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}

// Update user's payment method
export async function updateUserPaymentMethod(data: PaymentMethod) {
	try {
		const paymentMethod = paymentMethodSchema.parse(data).type;
		const session = await auth();
		const currentUser = await prisma.user.findFirst({
			where: { id: session?.user?.id as string },
		});
		if (!currentUser) throw new Error("User not found");

		await prisma.user.update({
			where: { id: currentUser.id },
			data: { paymentMethod },
		});
		return {
			success: true,
			message: "Payment method updated successfully",
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}

// Update user profile
export async function updateUserProfile(
	user: z.infer<typeof updateUserSchema>
) {
	try {
		await prisma.user.update({
			where: { id: user.id },
			data: { name: user.name, role: user.role },
		});
		revalidatePath("/admin/users");
		return {
			success: true,
			message: "Profile updated successfully",
		};
	} catch (error) {
		return { success: false, message: formatError(error) as string };
	}
}
