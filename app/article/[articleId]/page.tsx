import { getStoryByUri } from "@/lib/nyt";
import ArticleModalContent from "@/app/components/ArticleModalContent";
import Link from "next/link";
import { notFound } from "next/navigation";

// Since it's a server component in app dir, params is a Promise
type Props = {
    params: Promise<{
        articleId: string;
    }>;
};

export default async function ArticlePage({ params }: Props) {
    const { articleId } = await params;

    // Fetch story data using the URI
    const story = await getStoryByUri(articleId);

    if (!story) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#F4F6F8] flex flex-col items-center justify-center p-4">

            {/* Back to Home Link */}
            <div className="w-full max-w-5xl mb-4 flex justify-start">
                <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-2">
                    ← Back to Home
                </Link>
            </div>

            {/* Reused Modal Content (now as a page card) */}
            <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                <ArticleModalContent story={story} />
            </div>

        </div>
    );
}
