import { NextResponse } from "next/server";

const API_URL = "https://sportcore-production.up.railway.app/api";

export async function GET() {
  const baseUrl = "https://sportcore.kg";

  // Получаем категории
  const categoriesRes = await fetch(`${API_URL}/categories?populate=*&pagination[pageSize]=100`);
  const categoriesJson = await categoriesRes.json();
  const categories = categoriesJson.data || [];

  // Получаем товары
  const productsRes = await fetch(`${API_URL}/products?populate=*&pagination[pageSize]=200`);
  const productsJson = await productsRes.json();
  const products = productsJson.data || [];

  const staticPages = ["", "/cart", "/checkout", "/faq", "/search"].map(
    (path) => `${baseUrl}${path}`
  );

  const urls = [
    ...staticPages,
    ...categories.map((c: any) => `${baseUrl}/category/${c.attributes.slug}`),
    ...products.map((p: any) => `${baseUrl}/product/${p.attributes.slug}`),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `<url>
  <loc>${url}</loc>
  <lastmod>${new Date().toISOString()}</lastmod>
</url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: { "Content-Type": "application/xml" },
  });
}
