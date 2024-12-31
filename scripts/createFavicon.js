const fs = require('fs');
const { createCanvas } = require('canvas');

const canvas = createCanvas(16, 16);
const ctx = canvas.getContext('2d');

// Set background
ctx.fillStyle = '#282c34';
ctx.fillRect(0, 0, 16, 16);

// Draw "M"
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 14px Arial';
ctx.fillText('M', 2, 13);

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('public/favicon.ico', buffer); 