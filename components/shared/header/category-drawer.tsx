import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { getAllCategories } from "@/lib/actions/product.actions";
import { PRICE_RANGES } from "@/lib/constants";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import Search from "./search";

const CategoryDrawer = async () => {
	const categories = await getAllCategories();
	return (
		<>
			<Drawer direction="left">
				<DrawerTrigger asChild>
					<Button variant={"outline"}>
						<MenuIcon />
					</Button>
				</DrawerTrigger>
				<DrawerContent className="h-full max-w-xs lg:max-w-xs bg-accent/60 backdrop-blur-lg border-0">
					<DrawerHeader>
						<DrawerTitle className="font-heading font-medium text-2xl">
							Select a category
						</DrawerTitle>
						<div className="flex flex-col mt-2">
							<Button
								variant="ghost"
								className="w-full flex items-center justify-start"
								asChild
							>
								<DrawerClose asChild>
									<Link
										href={`/search?category=all`}
										className="w-full flex items-center justify-start"
									>
										All Categories
									</Link>
								</DrawerClose>
							</Button>
							{categories.map((x) => (
								<Button
									key={x.category}
									variant="ghost"
									className="w-full flex items-center justify-start"
									asChild
								>
									<DrawerClose asChild>
										<Link
											href={`/search?category=${x.category}`}
											className="w-full flex items-center justify-start"
										>
											{x.category} ({x._count})
										</Link>
									</DrawerClose>
								</Button>
							))}
							<Search wrap={true} />
						</div>
					</DrawerHeader>
					<DrawerHeader>
						<DrawerTitle className="font-heading font-medium text-2xl">
							Price
						</DrawerTitle>
						<div className="flex flex-col mt-2">
							<Button
								variant="ghost"
								className="w-full flex items-center justify-start"
								asChild
							>
								<DrawerClose asChild>
									<Link
										href={`/search?price=all`}
										className="w-full flex items-center justify-start"
									>
										All
									</Link>
								</DrawerClose>
							</Button>
							{PRICE_RANGES.map((x) => (
								<Button
									key={x.value}
									variant="ghost"
									className="w-full flex items-center justify-start"
									asChild
								>
									<DrawerClose asChild>
										<Link
											href={`/search?price=${x.value}`}
											className="w-full flex items-center justify-start"
										>
											{x.name}
										</Link>
									</DrawerClose>
								</Button>
							))}
						</div>
					</DrawerHeader>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default CategoryDrawer;
