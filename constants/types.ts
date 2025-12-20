import {
    HamzaDocument,
    MainnavigationDocument,
    NavbarDocument,
    NewscontentcardDocument,
    SearchbarDocument,
    SimplefooterDocument,
    TopnewsDocument
} from "@/prismicio-types";

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


export interface HomeClientProps {
    initialStories: NytStory[];
    slicesData: {
        page1: MainnavigationDocument;
        page: HamzaDocument;
        page2: NavbarDocument;
        page3: NewscontentcardDocument;
        page4: TopnewsDocument;
        page5: SimplefooterDocument;
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
