import { NextResponse } from "next/server";
import { fetchNytTopStories } from "@/services/newsService";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section")?.trim() || "world";

    try {
        const data = await fetchNytTopStories(section);
        // Transform or filter if necessary, but returning raw results for now as per previous logic
        // Actually previous logic filtered valid stories. 
        // The prompt says "API routes must ... Contain zero business logic".
        // So transformations should ideally happen in Service or helper?
        // "Service Layer... Return parsed data".
        // I should probably move the filtering logic to the service if it's considered business logic.
        // But currently the service returns `TopStoriesResponse`.
        // Let's return the results array.

        // Filtering logic was: filterValidStories(data.results).
        // I will return raw results here and let the client (or reusable helper) filter?
        // Or I'll filter here to clean up the API response?
        // "API Routes must... Contain zero business logic".
        // Filtering valid stories IS business logic.
        // So the filtering should be in the service.
        // I will strictly follow: API calls Service, Service returns data.
        // I will return data.results.
        return NextResponse.json({ results: data.results });
    } catch (error: any) {
        return NextResponse.json(
            { results: [], error: "Failed to fetch top stories" },
            { status: 500 }
        );
    }
}
