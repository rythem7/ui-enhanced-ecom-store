import { requireAdmin } from "@/lib/auth-guard";
import { Metadata } from "next";
import { getAllUsers, deleteUserById } from "@/lib/actions/user.actions";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/shared/pagination";
import { formatId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DeleteDialog from "@/components/shared/delete-dialog";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
	title: "Admin Users",
};

const AdminUserPage = async (props: {
	searchParams: Promise<{ page: string; query: string }>;
}) => {
	await requireAdmin();
	const { page = 1, query } = await props.searchParams;
	const users = await getAllUsers({ page: Number(page), query });
	return (
		<div className="space-y-2">
			<div className="flex items-center gap-3">
				<h1 className="font-bold text-2xl lg:text-3xl">Users</h1>
				{query && (
					<div>
						Filtered by <i>&quot;{query}&quot;</i>{" "}
						<Link href={`/admin/users`}>
							<Button variant={"outline"} size={"sm"}>
								Remove Filter
							</Button>
						</Link>
					</div>
				)}
			</div>
			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>NAME</TableHead>
							<TableHead>EMAIL</TableHead>
							<TableHead className="text-center">ROLE</TableHead>
							<TableHead className="text-center">
								ACTIONS
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.data.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={6}
									className="text-center p-4"
								>
									No users found.
								</TableCell>
							</TableRow>
						)}
						{users.data.map((user) => (
							<TableRow key={user.id}>
								<TableCell className="font-medium">
									{formatId(user.id)}
								</TableCell>
								<TableCell className="font-medium">
									{user.name}
								</TableCell>
								<TableCell className="font-medium">
									{user.email}
								</TableCell>
								<TableCell className="font-medium text-center">
									{user.role === "user" ? (
										<Badge variant={"secondary"}>
											User
										</Badge>
									) : (
										<Badge variant={"default"}>Admin</Badge>
									)}
								</TableCell>
								<TableCell className="text-right">
									<Button
										size={"sm"}
										asChild
										variant="outline"
									>
										<Link href={`/admin/users/${user.id}`}>
											Edit
										</Link>
									</Button>
									<DeleteDialog
										id={user.id}
										action={deleteUserById}
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				{users.totalPages > 1 && (
					<div className="mt-4 flex justify-end">
						<Pagination
							page={Number(page) || 1}
							totalPages={users?.totalPages}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminUserPage;
