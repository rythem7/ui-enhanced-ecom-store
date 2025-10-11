// hooks/useCart.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Cart } from "@/types";

export function useCart() {
	return useQuery<Cart>({
		queryKey: ["cart"],
		queryFn: async () => {
			const { data } = await axios.get("/api/cart");
			return data;
		},
		// staleTime: 1000 * 10, // 10 seconds
	});
}
