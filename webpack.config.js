const path = require('path');

module.exports = {
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            // Point to legacy build

            // For pdfjs-dist 2.7.570
            // 'pdfjs-dist': path.resolve('./node_modules/pdfjs-dist/es5/build/pdf.js'),

            // For pdfjs-dist 2.8.335 and later
            'pdfjs-dist': path.resolve('./node_modules/pdfjs-dist/legacy/build/pdf.js'),
        },
    },
};