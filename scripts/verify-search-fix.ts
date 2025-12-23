
import { mapSearchDocsToStories, filterValidStories } from "../lib/nyt";
import { NytSearchDoc } from "../types/types";

// Mock Data
const mockDoc: NytSearchDoc = {
    _id: "123",
    web_url: "http://example.com",
    snippet: "",
    lead_paragraph: "This is the lead paragraph.",
    abstract: "", // Empty to test fallback
    source: "NYT",
    multimedia: [
        {
            url: "images/2023/12/23/image.jpg",
            format: "xlarge",
            height: 600,
            width: 800,
            type: "image",
            subtype: "xlarge",
            caption: "Test Image",
            copyright: "NYT",
        },
    ],
    headline: {
        main: "Test Headline",
        kicker: "",
        content_kicker: "",
        print_headline: "",
        name: "",
        seo: "",
        sub: "",
    },
    keywords: [],
    pub_date: "2023-12-23",
    document_type: "article",
    news_desk: "Technology",
    section_name: "Technology",
    byline: { original: "By Me", organization: "", person: [] },
    type_of_material: "News",
    word_count: 100,
    uri: "nyt://article/123",
};

const mockDocWithAbsoluteImage: NytSearchDoc = {
    ...mockDoc,
    multimedia: [
        {
            url: "https://static01.nyt.com/images/existing.jpg",
            format: "xlarge",
            height: 600,
            width: 800,
            type: "image",
            subtype: "xlarge",
            caption: "Test Image",
            copyright: "NYT",
        },
    ]
}

console.log("--- TEST 1: Abstract Fallback ---");
const stories = mapSearchDocsToStories([mockDoc]);
const story = stories[0];

if (story.abstract === "This is the lead paragraph.") {
    console.log("✅ SUCCESS: Abstract used lead_paragraph fallback.");
} else {
    console.error(`❌ FAILURE: Abstract is '${story.abstract}', expected 'This is the lead paragraph.'`);
}

console.log("\n--- TEST 2: Image Normalization (Relative) ---");
if (story.multimedia && story.multimedia[0].url === "https://static01.nyt.com/images/2023/12/23/image.jpg") {
    console.log("✅ SUCCESS: relative image URL normalized correctly.");
} else {
    console.error(`❌ FAILURE: Image URL is '${story.multimedia?.[0]?.url}'`);
}

console.log("\n--- TEST 3: Image Normalization (Absolute) ---");
const storiesAbsolute = mapSearchDocsToStories([mockDocWithAbsoluteImage]);
if (storiesAbsolute[0].multimedia && storiesAbsolute[0].multimedia[0].url === "https://static01.nyt.com/images/existing.jpg") {
    console.log("✅ SUCCESS: absolute image URL preserved correctly.");
} else {
    console.error(`❌ FAILURE: Image URL is '${storiesAbsolute[0].multimedia?.[0]?.url}'`);
}


console.log("\n--- TEST 4: Filter Strictness ---");
const filtered = filterValidStories(stories);
if (filtered.length === 1) {
    console.log("✅ SUCCESS: Story passed strict filtering.");
} else {
    console.error("❌ FAILURE: Story blocked by filter even with lead_paragraph.");
}
