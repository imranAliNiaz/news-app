// app/api/search-news/route.ts
import { NextResponse } from "next/server";
import { searchNews } from "@/lib/nyt";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  console.log(q)

  if (!q) {
    return NextResponse.json(
      { results: [], error: "Missing query parameter ?q=" },
      { status: 400 }
    );
  }

  try {
    const results = await searchNews(q);
    console.log(results)
    return NextResponse.json({ results });
  } catch (error: any) {
    console.error("SearchNews API route error", error);
    return NextResponse.json(
      { results: [], error: "Failed to fetch search results" },
      { status: 500 }
    );
  }
}
