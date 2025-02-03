document.addEventListener('DOMContentLoaded', function () {
    // Ensure bibleData is not re-declared
    if (typeof window.bibleData === 'undefined') {
        window.bibleData = {};
    }

    // Function to load all Bible books
    function loadBible() {
        const dataFiles = ['Genesis.json', 'Exodus.json']; // Add all your JSON files here
        dataFiles.forEach(file => {
            fetch(`data/${file}`)
                .then(response => response.json())
                .then(data => {
                    const bookName = file.replace('.json', '');
                    window.bibleData[bookName] = data;
                    console.log(`Loaded data for ${bookName}:`, data);
                    if (bookName === 'Genesis') {
                        displayCurrentResult('Genesis', '1', '1');
                    }
                });
        });
    }

    // Function to highlight all text in an input
    function highlightText(event) {
        event.target.select();
    }

    // Load the Bible data
    loadBible();

    const bookInput = document.getElementById("book-input");
    const chapterInput = document.getElementById("chapter-input");
    const verseInput = document.getElementById("verse-input");
    const currentResult = document.getElementById("current-result");
    const preview = document.querySelector("#preview .slide-content");
    const previewLocation = document.querySelector("#preview .verse-location");

    let originalSelectedIndex = null;

    if (!bookInput || !chapterInput || !verseInput || !currentResult || !preview || !previewLocation) {
        console.error("One or more elements are missing in the DOM.");
        return;
    }

    // Highlight text on focus
    bookInput.addEventListener("focus", highlightText);
    chapterInput.addEventListener("focus", highlightText);
    verseInput.addEventListener("focus", highlightText);

    // Disable left and right arrow keys inside inputs
    function disableArrowKeys(event) {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
        }
    }

    bookInput.addEventListener("keydown", disableArrowKeys);
    chapterInput.addEventListener("keydown", disableArrowKeys);
    verseInput.addEventListener("keydown", disableArrowKeys);

    // Handle Book Auto-Completion
    bookInput.addEventListener("input", function (event) {
        const value = bookInput.value;
        const match = Object.keys(window.bibleData).find(book => book.toLowerCase().startsWith(value.toLowerCase()));

        if (match) {
            bookInput.value = match;
            bookInput.setSelectionRange(value.length, match.length);
            chapterInput.value = "1";
            verseInput.value = "1";
            displayCurrentResult(match, chapterInput.value, verseInput.value);
        } else {
            currentResult.innerHTML = "";
        }
    });

    // Display current result
    function displayCurrentResult(book, chapter, verse) {
        console.log(`Displaying result for Book: ${book}, Chapter: ${chapter}, Verse: ${verse}`);
        if (window.bibleData[book]) {
            const chapterIndex = parseInt(chapter, 10) - 1;
            const verseRange = verse.includes('-') ? verse.split('-').map(v => parseInt(v, 10) - 1) : [parseInt(verse, 10) - 1, parseInt(verse, 10) - 1];
            console.log(`Accessing chapter index: ${chapterIndex}, verse range: ${verseRange}`);
            const chapterData = window.bibleData[book].chapters[chapterIndex];
            if (chapterData) {
                currentResult.innerHTML = "";
                let previewContent = "";
                let previewLocationContent = `${book} ${chapter}:${verseRange[0] + 1}`;
                if (verseRange[0] !== verseRange[1]) {
                    previewLocationContent += `-${verseRange[1] + 1}`;
                }
                chapterData.verses.forEach((verseData, index) => {
                    const verseElement = document.createElement("div");
                    verseElement.className = "verse-divider";
                    const verseNumber = document.createElement("div");
                    verseNumber.className = "verse-number";
                    verseNumber.textContent = `${book} ${chapter}:${index + 1}`;
                    const verseText = document.createElement("div");
                    verseText.className = "verse-text";
                    verseText.textContent = verseData.text;
                    verseElement.appendChild(verseNumber);
                    verseElement.appendChild(verseText);
                    if (index >= verseRange[0] && index <= verseRange[1]) {
                        verseElement.classList.add("verse-selected");
                        previewContent += `<div><span class="verse-tag">${index + 1}</span> ${verseData.text}</div>`;
                    }
                    verseElement.addEventListener("click", function (event) {
                        if (event.shiftKey && originalSelectedIndex !== null) {
                            const lastIndex = index;
                            document.querySelectorAll('.verse-selected').forEach(el => el.classList.remove('verse-selected'));
                            for (let i = Math.min(originalSelectedIndex, lastIndex); i <= Math.max(originalSelectedIndex, lastIndex); i++) {
                                currentResult.children[i].classList.add("verse-selected");
                            }
                            verseInput.value = `${Math.min(originalSelectedIndex, lastIndex) + 1}-${Math.max(originalSelectedIndex, lastIndex) + 1}`;
                        } else {
                            document.querySelectorAll('.verse-selected').forEach(el => el.classList.remove('verse-selected'));
                            verseElement.classList.add("verse-selected");
                            verseInput.value = index + 1;
                            originalSelectedIndex = index;
                        }
                        bookInput.value = book;
                        chapterInput.value = chapter;
                        updatePreview();
                    });
                    currentResult.appendChild(verseElement);
                });
                preview.innerHTML = previewContent;
                preview.appendChild(previewLocation); // Move verse location inside slide content
                previewLocation.innerHTML = previewLocationContent;
                console.log(`Displayed chapter: ${chapter}`);
            } else {
                currentResult.innerHTML = `${book} - Book exists, but chapter not found.`;
                console.log(`Chapter not found for index: ${chapterIndex}`);
            }
        } else {
            currentResult.innerHTML = "Book not found.";
            console.log(`Book not found: ${book}`);
        }
    }

    // Update preview area
    function updatePreview() {
        const selectedVerses = document.querySelectorAll('.verse-selected .verse-text');
        let previewContent = "";
        let previewLocationContent = "";
        let firstVerseNumber = null;
        let lastVerseNumber = null;
        selectedVerses.forEach((verse, index) => {
            const verseElement = verse.closest('.verse-divider');
            const verseNumber = verseElement.querySelector('.verse-number').textContent.split(':')[1];
            previewContent += `<div><span class="verse-tag">${verseNumber}</span> ${verse.textContent}</div>`;
            if (index === 0) {
                firstVerseNumber = verseNumber;
            }
            lastVerseNumber = verseNumber;
        });
        if (firstVerseNumber && lastVerseNumber) {
            previewLocationContent = `${bookInput.value} ${chapterInput.value}:${firstVerseNumber}`;
            if (firstVerseNumber !== lastVerseNumber) {
                previewLocationContent += `-${lastVerseNumber}`;
            }
        }
        preview.innerHTML = previewContent;
        preview.appendChild(previewLocation); // Move verse location inside slide content
        previewLocation.innerHTML = previewLocationContent;
        preview.style.height = '100%';
        preview.style.overflow = 'hidden';
        preview.style.whiteSpace = 'normal'; // Ensure text wraps
        preview.style.display = 'flex';
        preview.style.flexDirection = 'column';
        preview.style.justifyContent = 'center'; // Center content vertically
        previewLocation.style.marginTop = '10px'; // Ensure location is directly underneath the text

        // Adjust scale to fit content
        const scale = Math.min(preview.clientWidth / preview.scrollWidth, preview.clientHeight / preview.scrollHeight);
        preview.style.transform = `scale(${scale})`;
    }

    // Move to Chapter on Space or Right Arrow
    bookInput.addEventListener("keydown", function (event) {
        if (event.key === " " || event.key === "ArrowRight") {
            event.preventDefault();
            bookInput.setSelectionRange(bookInput.value.length, bookInput.value.length);
            chapterInput.focus();
        }
    });

    // Handle Chapter Input Validation
    chapterInput.addEventListener("input", function (event) {
        const book = bookInput.value;
        const chapter = parseInt(chapterInput.value, 10);

        if (window.bibleData[book] && (chapter < 1 || chapter > window.bibleData[book].chapters.length)) {
            chapterInput.setCustomValidity(`Chapter must be between 1 and ${window.bibleData[book].chapters.length}`);
        } else {
            chapterInput.setCustomValidity("");
        }
        verseInput.value = "1";
        displayCurrentResult(book, chapterInput.value, verseInput.value);
    });

    // Move to Verse on Enter, Space, or Right Arrow
    chapterInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " " || event.key === "ArrowRight") {
            event.preventDefault();
            verseInput.focus();
        } else if (event.key === "ArrowLeft") {
            bookInput.focus();
        }
    });

    // Handle Verse Input Validation
    verseInput.addEventListener("input", function (event) {
        const book = bookInput.value;
        const chapter = parseInt(chapterInput.value, 10);
        const verse = verseInput.value;

        const verseRange = verse.includes('-') ? verse.split('-').map(v => parseInt(v, 10)) : [parseInt(verse, 10)];
        if (window.bibleData[book] && window.bibleData[book].chapters[chapter - 1] && (verseRange[0] < 1 || verseRange[1] > window.bibleData[book].chapters[chapter - 1].verses.length)) {
            verseInput.setCustomValidity(`Verse must be between 1 and ${window.bibleData[book].chapters[chapter - 1].verses.length}`);
        } else {
            verseInput.setCustomValidity("");
        }
        displayCurrentResult(book, chapterInput.value, verseInput.value);
    });

    // Move to Chapter on Left Arrow, or log selection on Enter
    verseInput.addEventListener("keydown", function (event) {
        if (event.key === "ArrowLeft") {
            chapterInput.focus();
        } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            console.log(`Selected: ${bookInput.value} ${chapterInput.value}:${verseInput.value}`);
        }
    });

    // Set default selection to Genesis 1:1
    bookInput.value = "Genesis";
    chapterInput.value = "1";
    verseInput.value = "1";
    displayCurrentResult("Genesis", "1", "1");
});
