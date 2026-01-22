import { NextResponse } from 'next/server';

export async function GET() {
    const SHEET_ID = "16Hbgl5PIBxt-wkgm5vxsuncBiiFBXRCfcVLaPoxv0Fc"; 
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

    try {
        const response = await fetch(url, { next: { revalidate: 60 } });
        const csvData = await response.text();
        const lines = csvData.split('\n');
        const result = [];
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

        for (let i = 1; i < lines.length; i++) {
            const obj = {};
            const currentline = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

            headers.forEach((header, index) => {
                let value = currentline[index]?.replace(/"/g, '').trim() || "";
                obj[header] = value;
            });
            
            if (obj.Title) {
                // --- AUTO CATEGORIZATION LOGIC ---
                const t = obj.Title.toLowerCase();
                if (t.includes("jang") || t.includes("newspaper") || t.includes("صحافت") || t.includes("اخبار")) {
                    obj.Category = "Media & Journalism";
                } else if (t.includes("banking") || t.includes("economy") || t.includes("finance") || t.includes("اسلامی بینکاری")) {
                    obj.Category = "Finance & Business";
                } else if (t.includes("history") || t.includes("untold") || t.includes("legacy") || t.includes("تاریخ") || t.includes("داستان")) {
                    obj.Category = "History & Legacy";
                } else if (t.includes("ramadan") || t.includes("eid") || t.includes("zikre") || t.includes("تبصرہ") || t.includes("کتاب")) {
                    obj.Category = "Religion & Books";
                } else {
                    obj.Category = "Archive";
                }
                result.push(obj);
            }
        }
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}