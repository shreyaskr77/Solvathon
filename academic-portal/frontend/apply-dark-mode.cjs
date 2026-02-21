const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = [
    {
        regex: /(?<!dark:)\bbg-white(?:\/[0-9]+)?\b/g, replacement: (match) => {
            const opacity = match.includes('/') ? match.split('/')[1] : '';
            return `${match} dark:bg-apple-light${opacity ? '/' + opacity : ''}`;
        }
    },
    {
        regex: /(?<!dark:)\bbg-slate-50(?:\/[0-9]+)?\b/g, replacement: (match) => {
            const opacity = match.includes('/') ? match.split('/')[1] : '';
            return `${match} dark:bg-apple-bg${opacity ? '/' + opacity : ''}`;
        }
    },
    {
        regex: /(?<!dark:)\bbg-gray-50(?:\/[0-9]+)?\b/g, replacement: (match) => {
            const opacity = match.includes('/') ? match.split('/')[1] : '';
            return `${match} dark:bg-apple-bg${opacity ? '/' + opacity : ''}`;
        }
    },
    {
        regex: /(?<!dark:)\bbg-slate-100(?:\/[0-9]+)?\b/g, replacement: (match) => {
            const opacity = match.includes('/') ? match.split('/')[1] : '';
            return `${match} dark:bg-gray-800${opacity ? '/' + opacity : ''}`;
        }
    },
    {
        regex: /(?<!dark:)\bbg-gray-100(?:\/[0-9]+)?\b/g, replacement: (match) => {
            const opacity = match.includes('/') ? match.split('/')[1] : '';
            return `${match} dark:bg-gray-800${opacity ? '/' + opacity : ''}`;
        }
    },
    {
        regex: /(?<!dark:)\btext-slate-800(?:\/[0-9]+)?\b/g, replacement: (match) => {
            const opacity = match.includes('/') ? match.split('/')[1] : '';
            return `${match} dark:text-gray-100${opacity ? '/' + opacity : ''}`;
        }
    },
    {
        regex: /(?<!dark:)\btext-gray-800(?:\/[0-9]+)?\b/g, replacement: (match) => {
            const opacity = match.includes('/') ? match.split('/')[1] : '';
            return `${match} dark:text-gray-100${opacity ? '/' + opacity : ''}`;
        }
    },
    {
        regex: /(?<!dark:)\btext-slate-700(?:\/[0-9]+)?\b/g, replacement: (match) => {
            const opacity = match.includes('/') ? match.split('/')[1] : '';
            return `${match} dark:text-gray-200${opacity ? '/' + opacity : ''}`;
        }
    },
    {
        regex: /(?<!dark:)\btext-gray-700(?:\/[0-9]+)?\b/g, replacement: (match) => {
            const opacity = match.includes('/') ? match.split('/')[1] : '';
            return `${match} dark:text-gray-200${opacity ? '/' + opacity : ''}`;
        }
    },
    {
        regex: /(?<!dark:)\btext-slate-600(?:\/[0-9]+)?\b/g, replacement: (match) => {
            const opacity = match.includes('/') ? match.split('/')[1] : '';
            return `${match} dark:text-gray-300${opacity ? '/' + opacity : ''}`;
        }
    },
    {
        regex: /(?<!dark:)\btext-gray-600(?:\/[0-9]+)?\b/g, replacement: (match) => {
            const opacity = match.includes('/') ? match.split('/')[1] : '';
            return `${match} dark:text-gray-300${opacity ? '/' + opacity : ''}`;
        }
    },
    {
        regex: /(?<!dark:)\btext-slate-500(?:\/[0-9]+)?\b/g, replacement: (match) => {
            const opacity = match.includes('/') ? match.split('/')[1] : '';
            return `${match} dark:text-gray-400${opacity ? '/' + opacity : ''}`;
        }
    },
    {
        regex: /(?<!dark:)\btext-gray-500(?:\/[0-9]+)?\b/g, replacement: (match) => {
            const opacity = match.includes('/') ? match.split('/')[1] : '';
            return `${match} dark:text-gray-400${opacity ? '/' + opacity : ''}`;
        }
    },
    {
        regex: /(?<!dark:)\btext-slate-900(?:\/[0-9]+)?\b/g, replacement: (match) => {
            const opacity = match.includes('/') ? match.split('/')[1] : '';
            return `${match} dark:text-gray-100${opacity ? '/' + opacity : ''}`;
        }
    },
    {
        regex: /(?<!dark:)\btext-gray-900(?:\/[0-9]+)?\b/g, replacement: (match) => {
            const opacity = match.includes('/') ? match.split('/')[1] : '';
            return `${match} dark:text-gray-100${opacity ? '/' + opacity : ''}`;
        }
    },
    {
        regex: /(?<!dark:)\bborder-slate-200(?:\/[0-9]+)?\b/g, replacement: (match) => {
            const opacity = match.includes('/') ? match.split('/')[1] : '';
            return `${match} dark:border-gray-700${opacity ? '/' + opacity : ''}`;
        }
    },
    {
        regex: /(?<!dark:)\bborder-gray-200(?:\/[0-9]+)?\b/g, replacement: (match) => {
            const opacity = match.includes('/') ? match.split('/')[1] : '';
            return `${match} dark:border-gray-700${opacity ? '/' + opacity : ''}`;
        }
    },
    {
        regex: /(?<!dark:)\bborder-slate-300(?:\/[0-9]+)?\b/g, replacement: (match) => {
            const opacity = match.includes('/') ? match.split('/')[1] : '';
            return `${match} dark:border-gray-600${opacity ? '/' + opacity : ''}`;
        }
    },
    {
        regex: /(?<!dark:)\bborder-gray-300(?:\/[0-9]+)?\b/g, replacement: (match) => {
            const opacity = match.includes('/') ? match.split('/')[1] : '';
            return `${match} dark:border-gray-600${opacity ? '/' + opacity : ''}`;
        }
    },
    {
        regex: /(?<!dark:)\bborder-slate-100(?:\/[0-9]+)?\b/g, replacement: (match) => {
            const opacity = match.includes('/') ? match.split('/')[1] : '';
            return `${match} dark:border-gray-800${opacity ? '/' + opacity : ''}`;
        }
    },
    {
        regex: /(?<!dark:)\bborder-gray-100(?:\/[0-9]+)?\b/g, replacement: (match) => {
            const opacity = match.includes('/') ? match.split('/')[1] : '';
            return `${match} dark:border-gray-800${opacity ? '/' + opacity : ''}`;
        }
    },
];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            replacements.forEach(({ regex, replacement }) => {
                content = content.replace(regex, replacement);
            });

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

processDirectory(directoryPath);
console.log("Done adding dark variants!");
