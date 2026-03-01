import LandingPage from "./components/LandingPage";

// Shared data-fetching function (also used by /library)
export async function fetchVideos() {
  try {
    const SHEET_ID = "1D9-9h9okbTsKaDD1TuxfQVklV1kKsa23";
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;
    const response = await fetch(url, { next: { revalidate: 3600 } });
    const csvData = await response.text();
    const lines = csvData.split('\n');
    const result = [];
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const obj = {};
      const currentline = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      headers.forEach((header, index) => {
        let value = currentline[index]?.replace(/"/g, '').trim() || "";
        obj[header] = value;
      });
      if (obj.Title) {
        const seriesRaw = obj["Series"] || obj["Series "] || "";
        obj.Category = seriesRaw.trim() !== "" ? seriesRaw.trim() : "General Archive";
        obj.Views = parseInt(obj.Views) || 0;
        result.push(obj);
      }
    }
    return result;
  } catch (err) {
    console.error("Failed to fetch videos:", err);
    return [];
  }
}

export default async function Home() {
  const videos = await fetchVideos();

  // Build category stats for the landing page
  const categoryCounts = {};
  videos.forEach(v => {
    categoryCounts[v.Category] = (categoryCounts[v.Category] || 0) + 1;
  });

  const categories = [
    { id: 'All', name: 'All Videos', count: videos.length },
    ...Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ id: name, name, count }))
  ];

  // Top 4 videos by views for the featured section
  const featuredVideos = [...videos]
    .sort((a, b) => (Number(b.Views) || 0) - (Number(a.Views) || 0))
    .slice(0, 12);

  return (
    <>
      {/* Hidden SEO content for Google */}
      <div className="sr-only">
        <h1>Zikre Kitab — Book Reviews, Urdu Literature &amp; Biographies</h1>
        <p>Explore our collection of {videos.length} book reviews and literary sessions.</p>
        <ul>
          {videos.slice(0, 20).map((v, i) => (
            <li key={i}>
              <a href={v['Video url']}>{v.Title}</a>
              {v.Guest && <span> — {v.Guest}</span>}
            </li>
          ))}
        </ul>
      </div>

      <LandingPage totalVideos={videos.length} categories={categories} featuredVideos={featuredVideos} />
    </>
  );
}