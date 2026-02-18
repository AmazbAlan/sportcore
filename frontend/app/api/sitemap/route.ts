import { NextResponse } from "next/server";

const API_URL = "https://sportcore-production.up.railway.app/api";
const BASE_URL = "https://sportcore.kg";

type StrapiItem = { attributes?: { slug?: string | null } };

async function safeFetchJson(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function getSlug(item: StrapiItem): string | null {
  const slug = item?.attributes?.slug;
  if (typeof slug !== "string") return null;
  const s = slug.trim();
  return s.length ? s : null;
}

function isString(x: unknown): x is string {
  return typeof x === "string" && x.length > 0;
}

export async function GET() {
  const categoriesJson = await safeFetchJson(
    `${API_URL}/categories?populate=*&pagination[pageSize]=100`
  );
  const categories: StrapiItem[] = Array.isArray(categoriesJson?.data)
    ? categoriesJson.data
    : [];

  const productsJson = await safeFetchJson(
    `${API_URL}/products?populate=*&pagination[pageSize]=200`
  );
  const products: StrapiItem[] = Array.isArray(productsJson?.data)
    ? productsJson.data
    : [];

  const staticPages = ["", "/cart", "/checkout", "/faq", "/search"].map(
    (path) => `${BASE_URL}${path}`
  );

  const categoryUrls = categories
    .map(getSlug)
    .filter(isString)
    .map((slug: string) => `${BASE_URL}/category/${slug}`);

  const productUrls = products
    .map(getSlug)
    .filter(isString)
    .map((slug: string) => `${BASE_URL}/product/${slug}`);

  const urls = Array.from(new Set([...staticPages, ...categoryUrls, ...productUrls]));
  const now = new Date().toISOString();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `<url>
  <loc>${url}</loc>
  <lastmod>${now}</lastmod>
</url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
