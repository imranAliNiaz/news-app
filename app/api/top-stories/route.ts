import { NextResponse } from "next/server";
import { fetchNytTopStories } from "@/services/newsService";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section")?.trim() || "world";

    try {
        const data = await fetchNytTopStories(section);
        return NextResponse.json({ results: data.results });

    } catch (error: any) {
        return NextResponse.json(
            { results: [], error: "Failed to fetch top stories" },
            { status: 500 }
        );
    }
}
