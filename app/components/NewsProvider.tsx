"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface NewsContextType {
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export function NewsProvider({ children }: { children: ReactNode }) {
    const [selectedCategory, setSelectedCategory] = useState<string>("world");

    return (
        <NewsContext.Provider value={{ selectedCategory, setSelectedCategory }}>
            {children}
        </NewsContext.Provider>
    );
}

export function useNewsCategory() {
    const context = useContext(NewsContext);
    if (context === undefined) {
        throw new Error("useNewsCategory must be used within a NewsProvider");
    }
    return context;
}
