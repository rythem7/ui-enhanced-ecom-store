"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signInDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { useSearchParams } from "next/navigation";

const CredentialsSignInForm = () => {
	const [data, action] = useActionState(signInWithCredentials, {
		success: false,
		message: "",
	});

	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/";

	const SignInButton = () => {
		const { pending } = useFormStatus();

		return (
			<button
				disabled={pending}
				className="w-full btn btn-primary text-primary-content"
			>
				{pending ? "Signing In..." : "Sign In"}
			</button>
		);
	};

	return (
		<form action={action}>
			<input type="hidden" name="callbackUrl" value={callbackUrl} />
			<div>
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					name="email"
					type="email"
					required
					autoComplete="email"
					defaultValue={signInDefaultValues.email}
				/>
			</div>
			<div className="mt-3">
				<Label htmlFor="password">Password</Label>
				<Input
					id="password"
					name="password"
					type="password"
					required
					defaultValue={signInDefaultValues.password}
				/>
			</div>
			<div className="mt-6">
				<SignInButton />
			</div>

			{data && !data.success && (
				<div className="text-center text-destructive">
					{data.message}
				</div>
			)}

			<div className="text-sm text-center text-base-content/60 mt-3">
				{"Don't have an account? "}
				<Link href={"/sign-up"} target="_self" className="link">
					Sign Up
				</Link>
			</div>
		</form>
	);
};

export default CredentialsSignInForm;
