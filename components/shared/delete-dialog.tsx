"use client";

import { useState, useTransition } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/alert-dialog";

const DeleteDialog = ({
	id,
	action,
}: {
	id: string;
	action: (id: string) => Promise<{ success: boolean; message: string }>;
}) => {
	const [isPending, startTransition] = useTransition();
	const [isOpen, setIsOpen] = useState(false);

	const onDelete = () => {
		startTransition(async () => {
			const { success, message } = await action(id);
			if (success) {
				toast.success(message);
				setIsOpen(false);
			} else {
				toast.error(message);
			}
		});
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogTrigger asChild>
				<Button variant="destructive" className="ml-2" size={"sm"}>
					Delete
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="text-lg font-semibold">
						Are you absolutely sure?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button
						variant="destructive"
						size={"sm"}
						onClick={onDelete}
						disabled={isPending}
					>
						{isPending ? "Deleting..." : "Yes, Delete"}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteDialog;
