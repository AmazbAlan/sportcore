// frontend/app/api/categories/route.ts
import { NextResponse } from "next/server";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

type StrapiCategoryEntry = {
  attributes?: {
    name?: string | null;
    slug?: string | null;
  };
};

export async function GET() {
  try {
    const res = await fetch(`${STRAPI_URL}/api/categories?populate=*`, {
      cache: "no-store",
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      return NextResponse.json(
        { error: "Failed to fetch categories", status: res.status, message: msg },
        { status: 500 }
      );
    }

    const json = await res.json();

    const data: StrapiCategoryEntry[] = Array.isArray(json?.data) ? json.data : [];

    const cats = data
      .map((entry) => {
        const name = (entry.attributes?.name ?? "").trim();
        const slug = (entry.attributes?.slug ?? "").trim();
        if (!slug) return null; // slug обязателен
        return { name, slug };
      })
      .filter((x): x is { name: string; slug: string } => Boolean(x));

    return NextResponse.json(cats);
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed to fetch categories", message: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}
