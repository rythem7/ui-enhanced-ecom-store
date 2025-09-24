import { APP_NAME } from "@/lib/constants";

const Footer = () => {
	const currentYear = new Date().getFullYear();
	return (
		<div className="p-5 flex justify-center items-center text-base-content/60">
			{currentYear} {APP_NAME}. All rights reserved.
		</div>
	);
};

export default Footer;
