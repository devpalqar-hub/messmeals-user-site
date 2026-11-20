import type { StaticImageData } from "next/image";
import grilled from "../../../../assets/mess-menu-and-meal-plans/grilled.jpg";
import healthyPlate from "../../../../assets/mess-menu-and-meal-plans/healthy-plate.jpg";
import proteinBowl from "../../../../assets/mess-menu-and-meal-plans/protein-bowl.jpg";
import salad from "../../../../assets/mess-menu-and-meal-plans/salad.jpg";
import spread from "../../../../assets/mess-menu-and-meal-plans/spread.jpg";
import vegBowl from "../../../../assets/mess-menu-and-meal-plans/veg-bowl.jpg";

/**
 * Ambient food photography (Unsplash licence) for decorative sections only —
 * never shown as a specific menu item. A mess's own images take priority.
 */
export type FoodImage = { src: StaticImageData; alt: string };

const img = (src: StaticImageData, alt: string): FoodImage => ({ src, alt });

export const FOOD = {
  proteinBowl: img(proteinBowl, "High-protein bowl with grilled chicken, egg, corn and fresh vegetables"),
  vegBowl: img(vegBowl, "Colourful vegetable bowl with avocado, chickpeas and greens"),
  spread: img(spread, "Table spread of freshly cooked dishes"),
  salad: img(salad, "Fresh green salad with a glass of orange juice"),
  healthyPlate: img(healthyPlate, "Healthy plate with eggs, greens and avocado"),
  grilled: img(grilled, "Grilled chicken with grilled vegetables and lemon"),
} as const;
