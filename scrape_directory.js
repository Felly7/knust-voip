const https = require('https');
const fs = require('fs');

const url = 'https://voip.knust.edu.gh/';

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        // Regex to find list items with data-id (approximate pattern based on site structure)
        // Looking for: <li class="li-item" ...><a href="./extensions?deptid=XX" ...>Name</a>
        const regex = /<li[^>]*class="li-item"[^>]*>[\s\S]*?<a[^>]*href="\.\/extensions\?deptid=(\d+)"[^>]*>([\s\S]*?)<\/a>/gi;
        
        const units = [];
        let match;

        while ((match = regex.exec(data)) !== null) {
            const id = match[1];
            // Clean up the name (remove newlines, extra spaces)
            const name = match[2].replace(/\s+/g, ' ').trim();
            
            if (name && id) {
                units.push({
                    name: name,
                    id: id,
                    url: `https://voip.knust.edu.gh/extensions?deptid=${id}`,
                    type: 'Unit'
                });
            }
        }

        const jsContent = `const directoryData = ${JSON.stringify(units, null, 4)};\n\nif (typeof module !== 'undefined') module.exports = directoryData;`;
        
        fs.writeFileSync('directory_data.js', jsContent);
        console.log(`Successfully extracted ${units.length} units to directory_data.js`);
    });

}).on('error', (err) => {
    console.error('Error fetching data:', err.message);
});
