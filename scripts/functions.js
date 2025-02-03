function newFile() {
    console.log("New file function called");
    // Implement the functionality for creating a new file
}

function openFile() {
    console.log("Open file function called");
    // Implement the functionality for opening a file
}

function saveFile() {
    console.log("Save file function called");
    // Implement the functionality for saving a file
}

function goLive() {
    console.log("Go live function called");
    // Implement the functionality for going live
}

function previous() {
    console.log("Previous function called");
    // Implement the functionality for the previous button
}

function next() {
    console.log("Next function called");
    // Implement the functionality for the next button
}

function switchTab(event) {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    event.target.classList.add('active');
    const index = Array.from(tabs).indexOf(event.target);
    tabContents[index].classList.add('active');
}