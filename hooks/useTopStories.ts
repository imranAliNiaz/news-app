import { useQuery } from "@tanstack/react-query";
import { getTopStories } from "@/services/newsService";
import { NytStory } from "@/types/types";

export const useTopStories = (section: string) => {
    return useQuery<NytStory[], Error>({
        queryKey: ["topStories", section],
        queryFn: () => getTopStories(section),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
