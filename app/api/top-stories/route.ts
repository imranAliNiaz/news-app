// app/api/top-stories/route.ts
import { NextResponse } from "next/server";
import { getTopStories } from "@/lib/nyt";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section")?.trim() || "world";

    try {
        const data = await getTopStories(section);
        return NextResponse.json({ results: data.results });
    } catch (error: any) {
        console.error("Top Stories API route error", error);
        return NextResponse.json(
            { results: [], error: "Failed to fetch top stories" },
            { status: 500 }
        );
    }
}
