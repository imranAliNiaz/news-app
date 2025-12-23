import { useQuery } from "@tanstack/react-query";
import { searchNews } from "@/services/newsService";
import { NytStory } from "@/types/types";

export const useSearchNews = (query: string) => {
    return useQuery<NytStory[], Error>({
        queryKey: ["searchNews", query],
        queryFn: () => searchNews(query),
        enabled: !!query,
    });
};
