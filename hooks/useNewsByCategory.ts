import { useTopStories } from "./useTopStories";

export const useNewsByCategory = (category: string) => {
    return useTopStories(category);
};
