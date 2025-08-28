// Función principal para construir el filtro de productos
export function buildProductFilter(queryParams) {
  const { category, brand, subcategory } = queryParams;

  const filter = { active: true };

  // Filtro por marca
  if (brand) {
    const escapedBrand = brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.brand = { $regex: escapedBrand, $options: "i" };
  }

  // Filtro por categoría y subcategoría
  if (category) {
    // Si se proporciona una categoría Y una subcategoría,
    // se aplican ambos filtros.
    if (subcategory) {
      filter.categories = category;
       filter.subcategory = subcategory; 
    } else {
      // Si solo se proporciona una categoría, solo se aplica ese filtro.
      filter.categories = category;
    }
  }

  return filter;
}

// Las siguientes funciones pueden ser útiles para tu frontend:
export function getSubcategoriesByCategory(category) {
  const validSubcategories = {
    makeup: [
      "lipstick",
      "mascara",
      "blush",
      "eyeliner",
      "cushions",
      "eyeshadows",
    ],
  };

  return validSubcategories[category] || [];
}

export function getValidCategories() {
  return ["skincare", "makeup", "sets", "beauty-tools"];
}
