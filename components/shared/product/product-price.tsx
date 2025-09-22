import { cn } from "@/lib/utils";
import { formatNumberToCurrency } from "@/lib/utils";

const ProductPrice = ({
	value,
	className,
}: {
	value: number;
	className?: string;
}) => {
	const price = formatNumberToCurrency(value);
	const [intValue, floatValue] = price.split(".");
	const symbol = intValue.slice(0, 1);
	const int = intValue.slice(1);

	return (
		<p className={cn("text-2xl font-heading", className)}>
			<span className="font-light text-xs align-super">{symbol}</span>
			{int}
			<span className="font-light text-xs align-super">
				.{floatValue}
			</span>
		</p>
	);
};

export default ProductPrice;
