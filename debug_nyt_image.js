const fs = require('fs');
const path = require('path');
const https = require('https');

const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/NYT_API_KEY=(.+)/);
const apiKey = match ? match[1].trim() : null;

if (!apiKey) {
    console.error("Could not find NYT_API_KEY in .env.local");
    process.exit(1);
}

const query = "sports";
const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${encodeURIComponent(query)}&api-key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            const docs = json.response?.docs || [];
            console.log(`Found ${docs.length} docs for '${query}'`);

            docs.slice(0, 1).forEach((doc, i) => {
                console.log(`\n--- Doc ${i + 1}: ${doc.headline.main} ---`);
                console.log("Keys:", Object.keys(doc));
                console.log("Multimedia raw value:", JSON.stringify(doc.multimedia));
                console.log("Multimedia type check:", typeof doc.multimedia);
            });

        } catch (e) {
            console.error("Error parsing response", e);
        }
    });
}).on('error', (e) => {
    console.error("Error fetching data", e);
});
