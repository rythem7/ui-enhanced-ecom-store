"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "../ui/input";

const AdminSearch = () => {
	const pathname = usePathname();
	const formActionUrl = pathname.includes("/admin/orders")
		? "/admin/orders"
		: pathname.includes("/admin/users")
		? "/admin/users"
		: "/admin/products";

	const searchParams = useSearchParams();
	const [query, setQuery] = useState(searchParams.get("query") || "");

	useEffect(() => {
		setQuery(searchParams.get("query") || "");
	}, [searchParams]);

	return (
		<form action={formActionUrl} method="GET">
			<Input
				type="search"
				name="query"
				placeholder="Search..."
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				className="md:w-[100px] lg:w-[300px]"
			/>
			<button className="sr-only" type="submit">
				Search
			</button>
		</form>
	);
};

export default AdminSearch;
