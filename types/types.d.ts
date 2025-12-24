import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

export interface NytMultimedia {
    url: string;
    format: string;
    height: number;
    width: number;
    type: string;
    subtype: string;
    caption: string;
    copyright: string;
}

export interface NytStory {
    section: string;
    subsection: string;
    title: string;
    abstract: string;
    url: string;
    uri: string;
    byline: string;
    item_type: string;
    updated_date: string;
    created_date: string;
    published_date: string;
    material_type_facet: string;
    kicker: string;
    des_facet: string[];
    org_facet: string[];
    per_facet: string[];
    geo_facet: string[];
    multimedia: NytMultimedia[] | null;
    short_url: string;
}

export interface TopStoriesResponse {
    status: string;
    copyright: string;
    section: string;
    last_updated: string;
    num_results: number;
    results: NytStory[];
}

export interface SearchMeta {
    hits: number;
    offset: number;
    time: number;
}

export interface NytSearchDoc {
    abstract: string;
    web_url: string;
    snippet: string;
    lead_paragraph: string;
    source: string;
    multimedia: NytMultimedia[];
    headline: {
        main: string;
        kicker: string;
        content_kicker: string;
        print_headline: string;
        name: string;
        seo: string;
        sub: string;
    };
    keywords: {
        name: string;
        value: string;
        rank: number;
        major: string;
    }[];
    pub_date: string;
    document_type: string;
    news_desk: string;
    section_name: string;
    byline: {
        original: string;
        person: {
            firstname: string;
            middlename: string;
            lastname: string;
            qualifier: string;
            title: string;
            role: string;
            organization: string;
            rank: number;
        }[];
        organization: string;
    };
    type_of_material: string;
    _id: string;
    word_count: number;
    uri: string;
}

export interface ArticleSearchResponse {
    status: string;
    copyright: string;
    response: {
        docs: NytSearchDoc[];
        meta: SearchMeta;
    };
}

export interface NewsState {
    selectedCategory: string;
}

export interface HomeClientProps {
    initialStories: NytStory[];
    slicesData: {
        page1: Content.PageDocument;
        page: Content.PageDocument;
        page2: Content.PageDocument;
        page3: Content.PageDocument;
        page4: Content.PageDocument;
        page5: Content.PageDocument;
    };
}

export interface SearchClientProps {
    stories: NytStory[];
    title: string;
    query: string;
    slicesData: {
        header: Content.MainnavigationDocument;
        searchBar: Content.SearchbarDocument;
        footer: Content.SimplefooterDocument;
    };
}


export interface TopStoriesGridProps {
    initialStories?: NytStory[];
    title?: string;
}

export interface NewsCardProps {
    story: NytStory;
    onClick: () => void;
}


export interface SearchNewsGridProps {
    stories: NytStory[];
    title?: string;
}

export interface SearchNewsCardProps {
    story: NytStory;
    onClick: () => void;
}

export interface NewsModalProps {
    story: NytStory;
    onClose: () => void;
}


export interface ArticleModalContentProps {
    story: NytStory;
    onClose?: () => void;
}


export interface SearchPageProps {
    searchParams: Promise<{
        query?: string;
    }>;
}
