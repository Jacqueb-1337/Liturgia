const fs = require('fs');
const path = require('path');

const BIBLE_PATH = path.join(__dirname, 'data', 'bible-kjv.json');
let bibleData = {};

// Load Bible JSON
if (fs.existsSync(BIBLE_PATH)) {
    bibleData = JSON.parse(fs.readFileSync(BIBLE_PATH, 'utf8'));
} else {
    console.error("Bible JSON not found!");
}

// Function to search verses
function searchScripture(query) {
    if (!bibleData.books) return [];

    let results = [];
    bibleData.books.forEach(book => {
        book.chapters.forEach((chapter, chapterIndex) => {
            chapter.forEach((verse, verseIndex) => {
                if (verse.toLowerCase().includes(query.toLowerCase())) {
                    results.push(`${book.name} ${chapterIndex + 1}:${verseIndex + 1} - ${verse}`);
                }
            });
        });
    });

    return results;
}

// Handle search input
document.getElementById('scripture-search').addEventListener('input', function() {
    let query = this.value.trim();
    let results = searchScripture(query);
    let resultsList = document.getElementById('scripture-results');
    
    resultsList.innerHTML = "";
    results.forEach(result => {
        let li = document.createElement('li');
        li.textContent = result;
        resultsList.appendChild(li);
    });
});
