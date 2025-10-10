"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export const useScaleOnHover = (
	elementRef: React.RefObject<HTMLElement>,
	{
		scale = 1.02,
		upscaleDuration = 0.2,
		downscaleDuration = 0.3,
		upscaleEase = "power3.out",
		downscaleEase = "power3.out",
	}: {
		scale?: number;
		upscaleDuration?: number;
		downscaleDuration?: number;
		upscaleEase?: string;
		downscaleEase?: string;
	} = {}
) => {
	useGSAP(() => {
		if (elementRef.current) {
			elementRef.current.addEventListener("mouseenter", () => {
				gsap.to(elementRef.current, {
					scale,
					duration: upscaleDuration,
					ease: upscaleEase,
				});
			});

			elementRef.current.addEventListener("mouseleave", () => {
				gsap.to(elementRef.current, {
					scale: 1,
					duration: downscaleDuration,
					ease: downscaleEase,
				});
			});
		}
	}, []);
};
