"use client";

import { updateUserProfile } from "@/lib/actions/user.actions";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { userProfileSchema, updateUserSchema } from "@/lib/validators";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ProfileType = z.infer<typeof updateUserSchema>;

const ProfileForm = () => {
	const { data: session, update } = useSession();

	const userId = session?.user?.id;

	const form = useForm<ProfileType>({
		resolver: zodResolver(updateUserSchema),
		defaultValues: {
			name: session?.user?.name ?? "",
			email: session?.user?.email ?? "",
		},
	});

	const onSubmit = async (values: ProfileType) => {
		const res = await updateUserProfile(values);

		if (!res.success) {
			toast.error(res.message || "Something went wrong");
			return;
		}

		const newSession = {
			...session,
			user: {
				...session?.user,
				name: values.name,
			},
		};

		await update(newSession);

		toast.success(res.message || "Profile updated successfully");
	};

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-5"
				>
					<div className="flex flex-col gap-5">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormControl>
										<Input
											disabled
											placeholder="Email"
											className="input-field"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormControl>
										<Input
											placeholder="Name"
											className="input-field"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button
						type="submit"
						size={"lg"}
						className="button col-span-2 w-full"
						disabled={form.formState.isSubmitting}
					>
						{form.formState.isSubmitting
							? "Submitting..."
							: "Update Profile"}
					</Button>
				</form>
			</Form>
		</>
	);
};

export default ProfileForm;
