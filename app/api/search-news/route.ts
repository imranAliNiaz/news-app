import { NextResponse } from "next/server";
import { searchNytNews } from "@/services/newsService";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query")?.trim();

  if (!query) {
    return NextResponse.json(
      { results: [], error: "Missing query parameter" },
      { status: 400 }
    );
  }

  try {
    const results = await searchNytNews(query);
    return NextResponse.json({ results });
  } catch (error: any) {
    return NextResponse.json(
      { results: [], error: error.message || "Failed to search news" },
      { status: 500 }
    );
  }
}
