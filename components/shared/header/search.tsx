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

const Search = async ({
	wrap = false,
	drawer = false,
	inputClasses = "",
}: {
	wrap?: boolean;
	drawer?: boolean;
	inputClasses?: string;
}) => {
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
							<SelectValue
								placeholder="All"
								defaultValue={"all"}
							/>
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
					className={cn(
						"w-[150px] md:w-[200px] border-0 input focus-visible:ring-0",
						inputClasses
					)}
					placeholder="Search..."
				/>
				<Button
					type="submit"
					className={cn("border-0", drawer && "text-primary-content")}
					variant={"ghost"}
				>
					<SearchIcon />
				</Button>
			</div>
		</form>
	);
};

export default Search;
