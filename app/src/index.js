const { app, BrowserWindow, ipcMain, remote, Menu, BrowserView } = require('electron');

const path = require('path');


// require('electron-reload')(__dirname, {
//   electron: path.join(__dirname,'..', 'node_modules', '.bin', 'electron')
// });

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let dotaWindow;
let learnDotaWindow;
let switchToLearnDota;
let switchToDota;
let template = [];
Menu.setApplicationMenu(null)

const createWindow = () => {
  // Create the browser window.
  dotaWindow = new BrowserWindow({
    maxWidth:1000,
    maxHeight:800,
    show:false
  });

  learnDotaWindow = new BrowserWindow({
    maxWidth:1000,
    maxHeight:800,
    show:false
  })

  // switchToLearnDota = new BrowserWindow({
  //   useContentSize:true,
  //   width:108,
  //   height:27,
  //
  //   parent: dotaWindow,
  //   show:false,
  //   frame:false,
  //   webPreferences: {
  //     nodeIntegration: true
  //   }
  // })

  switchToLearnDota = new BrowserView({
    webPreferences: {
      nodeIntegration: true
    }
  });
  dotaWindow.setBrowserView(switchToLearnDota);

  let childX =  dotaWindow.getSize()[0] - 138;
  let childY =  dotaWindow.getSize()[1] - 37 ;

  switchToLearnDota.setBounds({ x: childX, y: childY, width: 108, height: 27 })
  switchToLearnDota.setAutoResize({
    horizontal:true,
    vertical:true
  })
  switchToLearnDota.webContents.loadURL(`file://${__dirname}/learnDotaTab.html`)



  switchToDota = new BrowserWindow({
    width:108,
    height:27,
    parent: learnDotaWindow,
    show:false,
    frame:false,
    webPreferences: {
      nodeIntegration: true
    }
  })


  // loading windows
  dotaWindow.loadURL(`https://www.reddit.com/r/DotA2/`);
  learnDotaWindow.loadURL(`https://www.reddit.com/r/learndota2/`);
  // switchToLearnDota.loadURL(`file://${__dirname}/learnDotaTab.html`);
  switchToDota.loadURL(`file://${__dirname}/dotaTab.html`);
  // https://www.reddit.com/r/DotA2/
  // file://${__dirname}/index.html
  // Open gracefully

  dotaWindow.once('ready-to-show', () => {
    dotaWindow.show();
  })


  // Open the DevTools.
  // learnDotaWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  dotaWindow.on('closed', () => {
    dotaWindow = null;
  });

  // Resetting switch sub button position each time show is called on parent window
  function setChildWindowPositionAndShow(win,child) {
    // let winPosition = win.getPosition();
    // let childX = winPosition[0] + win.getSize()[0] - child.getSize()[0] - 30;
    // let childY = winPosition[1] + win.getSize()[1] - child.getSize()[1] + 20 ;
    // child.setPosition(childX,childY);
    // child.show();
  }



  learnDotaWindow.on('show', () => {
    setChildWindowPositionAndShow(learnDotaWindow,switchToDota);
  })

  learnDotaWindow.on('closed', () => {
    learnDotaWindow = null;
  });


  // dotaWindow.on('maximize', () => {
  //   dotaWindow.unmaximize()
  // });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (dotaWindow === null) {
    createWindow();
  }
});

//Functions to show/hide related windows
function windowsShow(windows){
  windows.map((win) => { win.show() });
}

function windowsHide(windows){
  windows.map((win) => { win.hide() });
}


ipcMain.on('showLearnDota', (event,args) => {
  windowsShow([learnDotaWindow]);
  windowsHide([dotaWindow, switchToLearnDota]);
});

ipcMain.on('showDota', (event,args) => {
  windowsShow([dotaWindow])
  windowsHide([learnDotaWindow,switchToDota]);
});



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
