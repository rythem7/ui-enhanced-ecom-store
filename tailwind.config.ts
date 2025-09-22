import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				heading: ["var(--font-montserrat)", "sans-serif"],
				body: ["var(--font-roboto)", "var(--font-inter)", "sans-serif"],
			},
		},
	},
	plugins: [],
};

export default config;
