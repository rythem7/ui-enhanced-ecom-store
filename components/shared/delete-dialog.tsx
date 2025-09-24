"use client";

import { useState, useTransition } from "react";
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
				<button className="btn btn-error btn-sm rounded-field">
					Delete
				</button>
			</AlertDialogTrigger>
			<AlertDialogContent className="bg-warning text-warning">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-lg font-semibold">
						Are you absolutely sure?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className="rounded-field h-[31px] btn">
						Cancel
					</AlertDialogCancel>
					<button
						onClick={onDelete}
						disabled={isPending}
						className="btn btn-error btn-sm rounded-field"
					>
						{isPending ? "Deleting..." : "Yes, Delete"}
					</button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteDialog;
