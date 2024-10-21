const { ipcRenderer } = require('electron');

// Event listener for the browse button
const browseBtn = document.getElementById('browseBtn');
browseBtn.addEventListener('click', () => {
    
    // Send a message to the main process to open a dialog
    ipcRenderer.send('open-file-dialog');
});

// Event listener for the response from the main process
ipcRenderer.on('selected-directory', (event, path) => {
    console.log('Selected directory: ', path);

    const imgContainer = document.getElementById('imgContainer');
    
    // For now, I'm just going to have users select at single image at a time.
    // Once I get handle on that, it will likely be changed to only directories.
    // TODO: keep main.js congruent with ^^^
    const imageElement = document.createElement('img');

    const fs = require('fs');
    const buf = fs.readFileSync(path);

    const dcraw = require('dcraw');
    const image = dcraw(buf, { extractThumbnail: True });

    imageElement.src = image;

    imgContainer.appendChild(imageElement);
});
