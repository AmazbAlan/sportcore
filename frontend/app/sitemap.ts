import { MetadataRoute } from "next";

// ⚠️ Укажи свой Strapi API URL
const API_URL = "https://sportcore-production.up.railway.app/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Получаем категории
  const categoriesRes = await fetch(`${API_URL}/categories?populate=*&pagination[pageSize]=100`);
  const categoriesJson = await categoriesRes.json();

  // Получаем товары
  const productsRes = await fetch(`${API_URL}/products?populate=*&pagination[pageSize]=200`);
  const productsJson = await productsRes.json();

  const categories = categoriesJson.data || [];
  const products = productsJson.data || [];

  const baseUrl = "https://sportcore.kg";

  // Статические страницы
  const staticPages = [
    "",
    "/cart",
    "/checkout",
    "/faq",
    "/search",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  // Динамические категории
  const categoryUrls = categories.map((cat: any) => ({
    url: `${baseUrl}/category/${cat.attributes.slug}`,
    lastModified: new Date(cat.attributes.updatedAt),
  }));

  // Динамические товары
  const productUrls = products.map((prod: any) => ({
    url: `${baseUrl}/product/${prod.attributes.slug}`,
    lastModified: new Date(prod.attributes.updatedAt),
  }));

  return [...staticPages, ...categoryUrls, ...productUrls];
}
