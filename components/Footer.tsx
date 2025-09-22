import { APP_NAME } from "@/lib/constants";

const Footer = () => {
	const currentYear = new Date().getFullYear();
	return (
		<div className="p-5 flex justify-center items-center">
			{currentYear} {APP_NAME}. All rights reserved.
		</div>
	);
};

export default Footer;
