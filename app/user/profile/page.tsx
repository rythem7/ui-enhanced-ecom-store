import { Metadata } from "next";
import UpdateProfileForm from "./profile-form";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
	title: "Profile",
};

const ProfilePage = async () => {
	const session = await auth();
	return (
		<SessionProvider session={session}>
			<div className="max-w-md mx-auto space-y-4">
				<h2 className="font-bold text-2xl lg:text-3xl">Profile</h2>
				<UpdateProfileForm />
			</div>
		</SessionProvider>
	);
};

export default ProfilePage;
