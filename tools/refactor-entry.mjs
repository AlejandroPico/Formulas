import { readFile, writeFile } from 'node:fs/promises';
let html = await readFile('index.html', 'utf8');
html = html.replace(/^.*<script type="module" src="scripts\/(?:latest-formula-batch-[^"<]+|dynamic-catalog-refresh[^"<]*|formula-tooltip-boot[^"<]*|modal-enhancements[^"<]*)"><\/script>\r?\n/gm, '');
html = html.replace('</head>', '  <link rel="stylesheet" href="styles/atlas-refresh.css?v=20261001" />\n</head>');
html = html.replace('<section id="projectIntro"', '<section hidden id="projectIntro"');
await writeFile('index.html', html);
let sw = await readFile('service-worker.js', 'utf8');
sw = sw.replace('`${CACHE_PREFIX}1`', '`${CACHE_PREFIX}2`');
await writeFile('service-worker.js', sw);
