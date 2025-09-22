import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { getAllCategories } from "@/lib/actions/product.actions";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const Search = async ({ wrap = false }: { wrap?: boolean }) => {
	const categories = await getAllCategories();
	return (
		<form action="/search" method="GET">
			<div
				className={cn(
					"flex w-full max-w-sm md:max-w-md gap-2 items-center",
					wrap && "flex-wrap gap-1"
				)}
			>
				<section className="hidden md:block">
					<Select name="category">
						<SelectTrigger className="w-[150px] opacity-70 active:opacity-100">
							<SelectValue placeholder="All" />
						</SelectTrigger>
						<SelectContent className="bg-base-200">
							<SelectItem value="all" key={"All"}>
								All
							</SelectItem>
							{categories.map((x) => (
								<SelectItem value={x.category} key={x.category}>
									{x.category}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</section>
				<Input
					name="q"
					type="text"
					className="w-[200px] bg-base-100 focus:bg-base-200"
					placeholder="Search..."
				/>
				<Button type="submit" variant={"outline"}>
					<SearchIcon />
				</Button>
			</div>
		</form>
	);
};

export default Search;
