import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/auth";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	imageUploader: f({
		image: {
			maxFileSize: "4MB",
		},
	})
		// Set permissions and file types for this FileRoute
		.middleware(async () => {
			// This code runs on your server before upload
			const session = await auth();
			if (!session) throw new UploadThingError("Unauthorized");
			return { userId: session?.user?.id };
		})
		.onUploadComplete(async ({ metadata }) => {
			// This code RUNS ON YOUR SERVER after upload
			return { uploadedBy: metadata.userId };
		}),
} satisfies FileRouter;
export type OurFileRouter = typeof ourFileRouter;
