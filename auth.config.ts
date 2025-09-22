/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig = {
	providers: [],
	callbacks: {
		authorized({ request, auth }: any) {
			// Array of regex patters we want to protect
			const protectedPaths = [
				/\/shipping-address/,
				/\/payment-method/,
				/\/place-order/,
				/\/profile/,
				/\/user\/(.*)/,
				/\/order\/(.*)/,
				/\/admin/,
			];

			// Get pathname of the request
			const { pathname } = request.nextUrl;

			// Check if user is trying to access a protected route
			if (
				!auth &&
				protectedPaths.some((pattern) => pattern.test(pathname))
			)
				return false;

			// Check for session cart cookie
			if (!request.cookies.get("sessionCartId")) {
				// Generate new session cart id cookie
				const sessionCartId = crypto.randomUUID();

				// Clone the request headers
				const newReqHeaders = new Headers(request.headers);

				// Create new response and add the new headers
				const response = NextResponse.next({
					request: {
						headers: newReqHeaders,
					},
				});

				// Set newly generated sessionCartId in the response cookies
				response.cookies.set("sessionCartId", sessionCartId);

				return response;
			} else {
				return true;
			}
		},
	},
} satisfies NextAuthConfig;
