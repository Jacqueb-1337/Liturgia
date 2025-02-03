let bibleData = {};

// Function to load all Bible books
function loadBible() {
    const dataFiles = ['genesis.json', 'exodus.json']; // Add all your JSON files here
    dataFiles.forEach(file => {
        fetch(`data/${file}`)
            .then(response => response.json())
            .then(data => {
                const bookName = file.replace('.json', '');
                bibleData[bookName] = data;
            });
    });
}

// Load the Bible data
loadBible();

// Function to search for a verse
function searchScripture(query) {
    let results = [];
    Object.keys(bibleData).forEach(book => {
        bibleData[book].chapters.forEach((chapter, chapterIndex) => {
            chapter.forEach((verse, verseIndex) => {
                if (verse.toLowerCase().includes(query.toLowerCase())) {
                    results.push(`${book} ${chapterIndex + 1}:${verseIndex + 1} - ${verse}`);
                }
            });
        });
    });
    return results;
}