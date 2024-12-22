const { ipcRenderer } = require('electron');

// Event listener for the browse button
const browseBtn = document.getElementById('browseBtn');
browseBtn.addEventListener('click', () => {
    
    // Send a message to the main process to open a dialog
    ipcRenderer.send('open-file-dialog');
});

// Event listener for the image-dict message
ipcRenderer.on('image-dict', (event, imageDict) => {
    console.log(`Received image list: ${imageDict['files']} at path: ${imageDict['path']}`);

    // Display the image list
    const fs = require('fs');
    const dcraw = require('dcraw');
    const path = imageDict['path'];
    imageDict['files'].forEach(file => {
        fs.readFile(`${path}/${file}`, (err, data) => {
            if (err) throw err;
            
            const thumbnail = dcraw(data, { extractThumbnail: true });
            const blob = new Blob([thumbnail], { type: 'image/jpeg' });
            const url = URL.createObjectURL(blob);
            const img = document.createElement('img');
            img.src = url;
            document.body.appendChild(img);
        });
    });
});
