"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signUpDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signUpUser } from "@/lib/actions/user.actions";
import { useSearchParams } from "next/navigation";

const SignUpForm = () => {
	const [data, action] = useActionState(signUpUser, {
		success: false,
		message: "",
	});

	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") ?? "/";

	const SignUpButton = () => {
		const { pending } = useFormStatus();

		return (
			<button
				disabled={pending}
				className="w-full btn btn-primary text-primary-content"
			>
				{pending ? "Signing Up..." : "Sign Up"}
			</button>
		);
	};
	return (
		<form action={action}>
			<input type="hidden" name="callbackUrl" value={callbackUrl} />
			<div className="space-y-6">
				<div>
					<Label htmlFor="name">Name</Label>
					<Input
						id="name"
						name="name"
						type="text"
						// required
						autoComplete="name"
						defaultValue={signUpDefaultValues.name}
					/>
				</div>
				<div>
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						name="email"
						// type="text"
						type="email"
						// required
						autoComplete="email"
						defaultValue={signUpDefaultValues.email}
					/>
				</div>
				<div>
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						name="password"
						type="password"
						required
						defaultValue={signUpDefaultValues.password}
					/>
				</div>
				<div>
					<Label htmlFor="confirmPassword">Confirm Password</Label>
					<Input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						required
						defaultValue={signUpDefaultValues.confirmPassword}
					/>
				</div>
				<div>
					<SignUpButton />
				</div>

				{data && !data.success && (
					<div className="text-center text-destructive">
						{data.message}
					</div>
				)}

				<div className="text-sm text-center text-muted-foreground mt-3">
					{"Already have an account? "}
					<Link href={"/sign-in"} target="_self">
						Sign In
					</Link>
				</div>
			</div>
		</form>
	);
};

export default SignUpForm;
