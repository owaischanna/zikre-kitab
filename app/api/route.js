import { NextResponse } from 'next/server';

export async function GET() {
    const SHEET_ID = "1D9-9h9okbTsKaDD1TuxfQVklV1kKsa23"; 
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

    try {
        const response = await fetch(url, { next: { revalidate: 60 } });
        const csvData = await response.text();
        const lines = csvData.split('\n');
        const result = [];
        
        // Headers are cleaned to remove quotes and whitespace
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
                // Map the Excel 'Series' column to 'Category'
                // Handles trailing spaces in header common in Excel CSV exports
                const seriesRaw = obj["Series"] || obj["Series "] || ""; 
                obj.Category = seriesRaw.trim() !== "" ? seriesRaw.trim() : "General Archive";
                
                // Keep Views as numeric for sorting logic
                obj.Views = parseInt(obj.Views) || 0;
                result.push(obj);
            }
        }
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}