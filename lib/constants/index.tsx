import { SunIcon, MoonIcon, SunMoon } from "lucide-react";

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Prostore";
export const APP_DESCRIPTION =
	process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
	"A modern store built with Next.js";
export const SERVER_URL =
	process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCTS_LIMIT =
	Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultValues = {
	email: "",
	password: "",
};

export const signUpDefaultValues = {
	name: "",
	email: "",
	password: "",
	confirmPassword: "",
};

export const shippingAddressDefaultValues = {
	fullName: "",
	streetAddress: "",
	city: "",
	postalCode: "",
	country: "",
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
	? process.env.PAYMENT_METHODS.split(", ")
	: ["PayPal", "Stripe", "CashOnDelivery"];

export const DEFAULT_PAYMENT_METHOD =
	process.env.DEFAULT_PAYMENT_METHOD || "PayPal";

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;

export const productDefaultValues = {
	name: "",
	slug: "",
	category: "",
	brand: "",
	description: "",
	stock: 0,
	rating: "0",
	images: [] as string[],
	isFeatured: false,
	banner: null,
	price: "0",
	numReviews: "0",
};

export const USER_ROLES = process.env.USER_ROLES
	? process.env.USER_ROLES.split(", ")
	: ["admin", "user"];

const priceSymbol = "₹";

export const PRICE_RANGES = [
	{ name: `${priceSymbol}500 to ${priceSymbol}1000`, value: "500-1000" },
	{ name: `${priceSymbol}1001 to ${priceSymbol}1500`, value: "1001-1500" },
	{ name: `${priceSymbol}1501 to ${priceSymbol}2000`, value: "1501-2000" },
	{ name: `${priceSymbol}2001 to ${priceSymbol}2500`, value: "2001-2500" },
	{ name: `${priceSymbol}2501 to ${priceSymbol}4000`, value: "2501-4000" },
];

export const RATINGS = [1, 2, 3, 4];
export const SORT_OPTIONS = [
	{ name: "Newest Arrivals", value: "newest" },
	{ name: "Price: Low to High", value: "lowest" },
	{ name: "Price: High to Low", value: "highest" },
	{ name: "Avg. Customer Review", value: "rating" },
];

export const reviewDefaultValues = {
	title: "",
	description: "",
	rating: 0,
};

export const SENDER_EMAIL = process.env.SENDER_EMAIL || "onboarding@resend.dev";

export const ACTIVE_OPTION_CLASS = "font-bold text-primary";
export const INACTIVE_OPTION_CLASS =
	"text-base-content/80 hover:text-base-content";

export const THEME_OPTIONS = [
	{ name: "system", icon: <SunMoon /> },
	{ name: "light", icon: <SunIcon /> },
	{ name: "cupcake", icon: <SunIcon /> },
	{ name: "fantasy", icon: <SunIcon /> },
	{ name: "emerald", icon: <SunIcon /> },
	{ name: "corporate", icon: <SunIcon /> },
	{ name: "pastel", icon: <SunIcon /> },
	{ name: "autumn", icon: <SunIcon /> },
	{ name: "lemonade", icon: <SunIcon /> },
	{ name: "silk", icon: <SunIcon /> },
	{ name: "coffee", icon: <MoonIcon /> },
	{ name: "luxury", icon: <MoonIcon /> },
	{ name: "aqua", icon: <MoonIcon /> },
	{ name: "dark", icon: <MoonIcon /> },
];
