import { getUserById } from "@/lib/actions/user.actions";
import { requireAdmin } from "@/lib/auth-guard";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import UserForm from "@/components/admin/user-form";

export const metadata: Metadata = {
	title: "Update User",
};
const AdminUserUpdatePage = async (props: {
	params: Promise<{ id: string }>;
}) => {
	await requireAdmin();

	const { id } = await props.params;
	const user = await getUserById(id);
	if (!user) return notFound();

	return (
		<div className="space-y-8 max-w-lg mx-auto">
			<h1 className="text-2xl font-bold lg:text-3xl">Update User</h1>
			<UserForm user={user} />
		</div>
	);
};

export default AdminUserUpdatePage;
