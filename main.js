const { app, BrowserWindow, dialog, ipcMain } = require('electron');

// Modules to control application life and create native browser window
const createWindow = () => {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          enableRemoteModule: true,
        }
    });
    
    // and load the index.html of the app.
    win.loadFile('index.html');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();

    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// ---

// Event listener for the open-file-dialog message.
// Prompts user to select image directory, parses for valid image files, and sends list back to renderer process.
ipcMain.on('open-file-dialog', (event) => {
    dialog.showOpenDialog({
        title: 'Select a folder',
        buttonLabel: 'Open',
        properties: ['openDirectory']
    }).then(result => {
        if (!result.canceled && result.filePaths.length > 0) {
            const fs = require('fs');
            const imageTypes = ['3fr', 'ari', 'arw', 'bay', 'braw', 'crw', 'cr2', 'cr3', 'cap', 'data', 'dcs', 'dcr', 'dng', 'drf', 'eip', 'erf', 'fff', 'gpr', 'iiq', 'k25', 'kdc', 'mdc', 'mef', 'mos', 'mrw', 'nef', 'nrw', 'obm', 'orf', 'pef', 'ptx', 'pxn', 'r3d', 'raf', 'raw', 'rwl', 'rw2', 'rwz', 'sr2', 'srf', 'srw', 'tif', 'x3f', 'png', 'jpg', 'jpeg'];
            let imageDict = {'path': result.filePaths[0], 'files': []};
            fs.readdir(result.filePaths[0], (err, files) => {
                if (err) throw err;

                const parsedFiles = files.filter(file => {
                    return imageTypes.includes(file.split('.').pop().toLowerCase());
                });
                imageDict['files'] = parsedFiles;
                event.sender.send('image-dict', imageDict);
            });
        }
    }).catch(err => {
        console.error(err);
    });
});
