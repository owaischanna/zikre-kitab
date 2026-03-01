import VideoLibrary from "../components/VideoLibrary";
import { fetchVideos } from "../page";

export const metadata = {
    title: "Library | Zikre Kitab",
    description:
        "Browse our complete archive of book reviews, literary interviews, biographies, and Urdu poetry sessions.",
};

export default async function LibraryPage({ searchParams }) {
    const videos = await fetchVideos();
    const params = await searchParams;
    const category = params?.category || "All";

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="sr-only">
                <h1>Zikre Kitab Library — Complete Archive of {videos.length} Sessions</h1>
                <ul>
                    {videos.slice(0, 30).map((v, i) => (
                        <li key={i}>
                            <a href={v["Video url"]}>{v.Title}</a>
                            {v.Guest && <span> — {v.Guest}</span>}
                        </li>
                    ))}
                </ul>
            </div>
            <VideoLibrary initialVideos={videos} initialCategory={category} />
        </main>
    );
}
