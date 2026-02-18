// frontend/app/sitemap.ts
import { MetadataRoute } from "next";

const API_URL = "https://sportcore-production.up.railway.app/api";
const BASE_URL = "https://sportcore.kg";

type StrapiEntry = {
  attributes?: {
    slug?: string | null;
    updatedAt?: string | null;
  };
  slug?: string | null;
  updatedAt?: string | null;
};

function getSlug(item: any): string | null {
  const s =
    item?.attributes?.slug ??
    item?.slug ??
    null;

  if (!s) return null;
  const slug = String(s).trim();
  return slug.length ? slug : null;
}

function getLastModified(item: any): Date {
  const u =
    item?.attributes?.updatedAt ??
    item?.updatedAt ??
    null;

  const d = u ? new Date(String(u)) : new Date();
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

async function fetchStrapiList(url: string): Promise<StrapiEntry[]> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  const json = await res.json().catch(() => null);
  return Array.isArray(json?.data) ? json.data : [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    fetchStrapiList(`${API_URL}/categories?populate=*&pagination[pageSize]=100`),
    fetchStrapiList(`${API_URL}/products?populate=*&pagination[pageSize]=200`),
  ]);

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = ["", "/cart", "/checkout", "/faq", "/search"].map(
    (path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: now,
    })
  );

  // ✅ flatMap — не возвращаем null
  const categoryUrls: MetadataRoute.Sitemap = categories.flatMap((c) => {
    const slug = getSlug(c);
    if (!slug) return [];
    return [
      {
        url: `${BASE_URL}/category/${slug}`,
        lastModified: getLastModified(c),
      },
    ];
  });

  const productUrls: MetadataRoute.Sitemap = products.flatMap((p) => {
    const slug = getSlug(p);
    if (!slug) return [];
    return [
      {
        url: `${BASE_URL}/product/${slug}`,
        lastModified: getLastModified(p),
      },
    ];
  });

  // ✅ Убираем дубли (если вдруг)
  const seen = new Set<string>();
  const all = [...staticPages, ...categoryUrls, ...productUrls].filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });

  return all;
}
