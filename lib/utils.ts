import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as z from "zod";
import { Prisma } from "./generated/prisma";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Capitalize first letter of a String
function capitalize(str = "") {
	if (typeof str !== "string" || str.length === 0) return "";
	return str.charAt(0).toUpperCase() + str.slice(1);
}

// Convert prisma object to regular JS Object
export function convertToPlainObject<T>(value: T): object {
	return JSON.parse(JSON.stringify(value));
}

// Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
	const [int, decimal] = num.toString().split(".");
	return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;

	// return num.toLocaleString("en-US", {
	// 	style: "decimal",
	// 	minimumFractionDigits: 2,
	// 	maximumFractionDigits: 2,
	// });
}

// Format number to INR currency
export function formatNumberToCurrency(num: number | string): string {
	const value = Number(num);
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value);
}

// Format errors
/* eslint-disable @typescript-eslint/no-explicit-any */
export function formatError(error: any) {
	if (error instanceof z.ZodError) {
		// Handle Zod Error
		const flattened = z.flattenError(error);

		const fieldErrors = Object.keys(flattened.fieldErrors)
			.map((field: string) => {
				const messagesArr = (
					flattened.fieldErrors as Record<string, string[]>
				)[field];
				return Array.isArray(messagesArr) ? messagesArr.join(", ") : "";
			})
			.join(". ");

		return fieldErrors;
	} else if (error instanceof Prisma.PrismaClientKnownRequestError) {
		// Handle Prisma Error
		if (error.code === "P2002") {
			const string = `${error.meta?.target} already exists, Please Sign In`;
			return capitalize(string);
		}
	} else {
		// Handle other errors
		if (error instanceof Error) {
			return typeof error.message === "string"
				? error.message
				: JSON.stringify(error.message);
		}
	}
}

// For ZOD errors:
// import * as z from "zod";
// use z.flattenError() to retrieve a clean, shallow error object
// Type- { errors: string[], properties: { [key: string]: string[] } }

// {
//   formErrors: [ 'Unrecognized key: "extraKey"' ],
//   fieldErrors: {
//     username: [ 'Invalid input: expected string, received number' ],
//     favoriteNumbers: [ 'Invalid input: expected number, received string' ]
//   }
// }

export function round2(value: number | string) {
	return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-IN", {
	currency: "INR",
	style: "currency",
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

// format currency using formatter above
export function formatCurrency(amount: number | string | null) {
	if (typeof amount === "number" || typeof amount === "string") {
		const number = Number(amount);
		return CURRENCY_FORMATTER.format(number);
	} else {
		return "NaN";
	}
}

// Shorten the UUID
export function formatId(id: string) {
	return `..${id.slice(-6)}`;
}

// Format date and time
export const formatDateTime = (dateString: Date) => {
	const dateTimeOptions: Intl.DateTimeFormatOptions = {
		month: "short", // abbreviated month name (e.g., 'Oct')
		year: "numeric", // abbreviated month name (e.g., 'Oct')
		day: "numeric", // numeric day of the month (e.g., '25')
		hour: "numeric", // numeric hour (e.g., '8')
		minute: "numeric", // numeric minute (e.g., '30')
		hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
	};
	const dateOptions: Intl.DateTimeFormatOptions = {
		weekday: "short", // abbreviated weekday name (e.g., 'Mon')
		month: "short", // abbreviated month name (e.g., 'Oct')
		year: "numeric", // numeric year (e.g., '2023')
		day: "numeric", // numeric day of the month (e.g., '25')
	};
	const timeOptions: Intl.DateTimeFormatOptions = {
		hour: "numeric", // numeric hour (e.g., '8')
		minute: "numeric", // numeric minute (e.g., '30')
		hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
	};
	const formattedDateTime: string = new Date(dateString).toLocaleString(
		"en-US",
		dateTimeOptions
	);
	const formattedDate: string = new Date(dateString).toLocaleString(
		"en-US",
		dateOptions
	);
	const formattedTime: string = new Date(dateString).toLocaleString(
		"en-US",
		timeOptions
	);
	return {
		dateTime: formattedDateTime,
		dateOnly: formattedDate,
		timeOnly: formattedTime,
	};
};

// Get Filter URL
export const getFilterUrl = (
	{
		c,
		s,
		p,
		r,
		pg,
		b,
	}: {
		c?: string;
		s?: string;
		p?: string;
		r?: string;
		b?: string;
		pg?: string;
	},
	currentParams: Record<string, string> = {}
) => {
	const params = { ...currentParams };
	if (c) params.category = c;
	if (s) params.sort = s;
	if (p) params.price = p;
	if (r) params.rating = r;
	if (pg) params.page = pg;
	if (b) params.brand = b;
	const newParams = new URLSearchParams(params).toString();
	return `/search?${newParams}`;
};
