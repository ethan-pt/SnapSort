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
});
