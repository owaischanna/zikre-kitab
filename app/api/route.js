import { NextResponse } from 'next/server';

export async function GET() {
    // New Sheet ID extracted from your link
    const SHEET_ID = "1D9-9h9okbTsKaDD1TuxfQVklV1kKsa23"; 
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

    try {
        const response = await fetch(url, { next: { revalidate: 60 } });
        const csvData = await response.text();
        const lines = csvData.split('\n');
        const result = [];
        
        // Extract headers and clean them
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;

            const obj = {};
            // Regex to handle commas inside quotes in CSV
            const currentline = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

            headers.forEach((header, index) => {
                let value = currentline[index]?.replace(/"/g, '').trim() || "";
                obj[header] = value;
            });
            
            if (obj.Title) {
                // --- NEW MAPPING LOGIC BASED ON SERIES COLUMN ---
                const series = obj["Series"] || ""; 
                const tag = obj["Tag 1"] || "";

                if (series.includes("افسانہ زندگی کا")) {
                    obj.Category = "Afsana Zindagi Ka";
                } else if (series.includes("کتابوں پر تبصرہ") || series.includes("کتابوں کے آئینے میں")) {
                    obj.Category = "Book Reviews";
                } else if (series.includes("کالم شاہ محی الحق فاروقی کے")) {
                    obj.Category = "Shah Mohi-ul-Haq Columns";
                } else if (series.includes("یاد رفتگاں")) {
                    obj.Category = "Yaad-e-Raftagan";
                } else if (series.includes("منتخب تحریں")) {
                    obj.Category = "Selected Readings";
                } else if (tag.includes("بینکاری") || obj.Title.toLowerCase().includes("bank")) {
                    // Fallback for banking videos if series is empty
                    obj.Category = "Finance & Business";
                } else {
                    obj.Category = "Archive";
                }

                result.push(obj);
            }
        }
        return NextResponse.json(result);
    } catch (error) {
        console.error("Fetch Error:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}