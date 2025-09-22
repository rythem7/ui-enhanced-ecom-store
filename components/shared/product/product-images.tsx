"use client";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const ProductImages = ({ images }: { images: string[] }) => {
	const [current, setCurrent] = useState(0);

	return (
		<div className="space-y-4">
			<Image
				src={images[current]}
				height={1000}
				width={1000}
				loading="lazy"
				alt="product image"
				className="w-full h-[400px] object-cover"
			/>
			<div className="flex flex-wrap gap-1">
				{images.map((image, index) => (
					<div
						key={image}
						onClick={() => setCurrent(index)}
						className={cn(
							"border cursor-pointer hover:border-orange-600",
							current === index && "border-orange-500"
						)}
					>
						<Image
							src={image}
							alt="image"
							width={100}
							height={100}
							loading="lazy"
							className="w-20 h-20 object-cover"
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default ProductImages;
