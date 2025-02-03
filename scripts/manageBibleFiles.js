const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_URL = "https://raw.githubusercontent.com/aruljohn/Bible-kjv/master/";
const DATA_DIR = 'data';

// Ensure the data folder exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// List of Bible books (JSON file names in repo)
const BOOKS = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
    "1Samuel", "2Samuel", "1Kings", "2Kings", "1Chronicles", "2Chronicles", "Ezra", "Nehemiah",
    "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "SongofSolomon", "Isaiah", "Jeremiah",
    "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah",
    "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew", "Mark", "Luke",
    "John", "Acts", "Romans", "1Corinthians", "2Corinthians", "Galatians", "Ephesians",
    "Philippians", "Colossians", "1Thessalonians", "2Thessalonians", "1Timothy", "2Timothy",
    "Titus", "Philemon", "Hebrews", "James", "1Peter", "2Peter", "1John", "2John", "3John",
    "Jude", "Revelation"
];

// Function to download a missing book
function downloadBook(book, callback) {
    const url = `${BASE_URL}${book}.json`;
    const filePath = `${DATA_DIR}/${book}.json`;

    console.log(`Checking ${book}...`);

    if (fs.existsSync(filePath)) {
        console.log(`${book} already exists.`);
        if (callback) callback();
        return;
    }

    console.log(`Downloading ${book}...`);
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`${book} downloaded successfully.`);
            if (callback) callback();
        });
    }).on('error', (err) => {
        console.error(`Error downloading ${book}:`, err);
        fs.unlink(filePath, () => {});
    });
}

// Function to check and download the Bible if not present
function checkAndDownloadBible() {
    // Check if the Bible file exists
    if (!bibleFileExists()) {
        // Download the Bible file
        downloadBibleFile();
    }
}

// Function to check if the Bible file exists
function bibleFileExists() {
    // Logic to check if the file exists
    // This is a placeholder, replace with actual implementation
    return false;
}

// Function to download the Bible file
function downloadBibleFile() {
    // Logic to download the file
    // This is a placeholder, replace with actual implementation
    console.log("Downloading Bible file...");
}

// Run the Bible check on startup
checkAndDownloadBible();
