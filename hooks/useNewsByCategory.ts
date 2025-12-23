import { useTopStories } from "./useTopStories";

// This hook might be redundant if useTopStories takes a section, 
// but prompt asked exactly for "useNewsByCategory.ts".
// I will implement it as a wrapper or similar.
export const useNewsByCategory = (category: string) => {
    return useTopStories(category);
};
