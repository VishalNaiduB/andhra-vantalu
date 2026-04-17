export function DietDot({ diet }: { diet: "veg" | "nonveg" }) {
  const isVeg = diet === "veg";
  return (
    <span
      className={isVeg ? "diet-dot-veg" : "diet-dot-nonveg"}
      title={isVeg ? "Vegetarian" : "Non-Vegetarian"}
      aria-label={isVeg ? "Vegetarian" : "Non-Vegetarian"}
    />
  );
}
