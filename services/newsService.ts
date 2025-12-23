import axios from "axios";
import { TopStoriesResponse, ArticleSearchResponse, NytStory } from "@/types/types";
import axiosInstance from "./axiosInstance";
import { mapSearchDocsToStories } from "@/lib/nyt";

const NYT_API_KEY = process.env.NYT_API_KEY || process.env.NEXT_PUBLIC_NYT_API_KEY;
const BASE_URL = "https://api.nytimes.com/svc";

// Server-side direct calls (using keys)
export const fetchNytTopStories = async (section: string): Promise<TopStoriesResponse> => {
    if (!NYT_API_KEY) throw new Error("NYT_API_KEY is not configured");

    const response = await axios.get(`${BASE_URL}/topstories/v2/${section}.json`, {
        params: { "api-key": NYT_API_KEY },
    });
    return response.data;
};

export const searchNytNews = async (query: string): Promise<NytStory[]> => {
    if (!NYT_API_KEY) throw new Error("NYT_API_KEY is not configured");

    const response = await axios.get<ArticleSearchResponse>(`${BASE_URL}/search/v2/articlesearch.json`, {
        params: {
            q: query,
            "api-key": NYT_API_KEY,
            sort: "relevance",
        },
    });

    return mapSearchDocsToStories(response.data.response.docs);
};

// Client-side fetchers (Call our API Routes)
export const getTopStories = async (section: string): Promise<NytStory[]> => {
    const response = await axiosInstance.get<{ results: NytStory[] }>("/top-stories", {
        params: { section },
    });
    return response.data.results;
};

export const searchNews = async (query: string): Promise<NytStory[]> => {
    const response = await axiosInstance.get<{ results: NytStory[] }>("/search-news", {
        params: { query },
    });
    return response.data.results;
};
