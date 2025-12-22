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

const query = "With Attacks on Oil Tankers, Ukraine Takes Aim at Russia's War Financing";
const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${encodeURIComponent(query)}&api-key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            const doc = json.response?.docs?.[0];
            if (doc) {
                console.log("Found article via query:", doc.headline.main);
                console.log("URI:", doc.uri);
                console.log("Multimedia type (query):", Array.isArray(doc.multimedia) ? "Array" : typeof doc.multimedia);
                // console.log("Multimedia raw (query):", JSON.stringify(doc.multimedia, null, 2));

                // Now fetch by URI
                const uriUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=uri:("${doc.uri}")&api-key=${apiKey}`;
                https.get(uriUrl, (res2) => {
                    let data2 = '';
                    res2.on('data', (chunk) => data2 += chunk);
                    res2.on('end', () => {
                        const json2 = JSON.parse(data2);
                        const doc2 = json2.response?.docs?.[0];
                        if (doc2) {
                            console.log("Found article via URI:", doc2.headline.main);
                            console.log("Multimedia type (URI):", Array.isArray(doc2.multimedia) ? "Array" : typeof doc2.multimedia);
                            console.log("Multimedia raw (URI):", JSON.stringify(doc2.multimedia, null, 2));
                        }
                    });
                });

            } else {
                console.log("No article found");
            }
        } catch (e) {
            console.error("Error parsing response", e);
        }
    });
}).on('error', (e) => {
    console.error("Error fetching data", e);
});
