import {
    HamzaDocument,
    MainnavigationDocument,
    NavbarDocument,
    NewscontentcardDocument,
    SearchbarDocument,
    SimplefooterDocument,
    TopnewsDocument
} from "@/prismicio-types";

// =========================================
// 📰 NYT API Types
// =========================================

export interface NytMultimedia {
    url: string;
    caption?: string;
    format?: string;
    height?: number;
    width?: number;
}

export interface NytStory {
    title: string;
    abstract: string;
    url: string;
    byline: string;
    published_date: string;
    section: string;
    multimedia?: NytMultimedia[];
}

export interface TopStoriesResponse {
    results: NytStory[];
}

/**
 * Raw Document interface from NYT Search API
 */
export interface NytSearchDoc {
    web_url: string;
    headline: {
        main: string;
    };
    multimedia: {
        url: string;
        caption?: string;
        subType?: string;
        subtype?: string;
        height?: number;
        width?: number;
    }[];
    abstract?: string;
    lead_paragraph?: string;
    byline?: {
        original: string;
    };
    pub_date: string;
    section_name?: string;
}

export interface NytSearchResponse {
    response: {
        docs: NytSearchDoc[];
    };
}

// =========================================
// ⚛️ Component Props
// =========================================

export interface HomeClientProps {
    initialStories: NytStory[];
    slicesData: {
        page1: MainnavigationDocument; // Header
        page: HamzaDocument;           // Landing Page
        page2: NavbarDocument;         // Announcement Bar
        page3: NewscontentcardDocument;// Featured Content
        page4: TopnewsDocument;        // Top News / Carousel
        page5: SimplefooterDocument;   // Footer
    };
}

export interface SearchClientProps {
    stories: NytStory[];
    title: string;
    query: string;
    slicesData: {
        header: MainnavigationDocument;
        searchBar: SearchbarDocument;
        footer: SimplefooterDocument;
    };
}
