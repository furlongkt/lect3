const electron = require("electron");
var fs = require('fs');
var db = require('diskdb');
db = db.connect('./db', ['events']);
let mainWindow;

const constructorMethod = () => {
  // Module to control application life.
  const app = electron.app;
  const Menu = electron.Menu;
  const dialog = electron.dialog;
  //Setup Menu
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open Calendar',
          accelerator: 'CmdOrCtrl+O',
          click() { openFile(); }
        },
        {
          label: 'Save Calendar',
          accelerator: 'CmdOrCtrl+S',
          click() { saveFile(); }
        },
        {
          type: 'separator'
        },
        {
          label: 'Clear Calendar',
          accelerator: 'CmdOrCtrl+C',
          click() { clearCalendar(); }
        }
      ]
    },
    {
      label: 'Mode',
      submenu: [
        {
          label: 'Phone View',
          accelerator: 'CmdOrCtrl+P',
          click() { changeView('phone'); }
        },
        {
          label: 'Tablet View',
          accelerator: 'CmdOrCtrl+T',
          click() { changeView('tablet'); }
        },
        {
          label: 'Desktop View',
          accelerator: 'CmdOrCtrl+D',
          click() { changeView('desktop'); }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  // Module to create native browser window.
  const BrowserWindow = electron.BrowserWindow;

  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.

  function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 1200, height: 900 })

    mainWindow.loadURL('http://localhost:3000/');
    mainWindow.maximize();

    // Open the DevTools.
    // mainWindow.webContents.openDevTools({mode: "undocked"});

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    })
  }

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)

  // Quit when all windows are closed.
  app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow()
    }
  })

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.

  function openFile(){
      console.log("Open");
      dialog.showOpenDialog({ 
          filters: [
            { 
              name: 'calendar', 
              extensions: ['kevsCal'] 
            }
      ]}, function (fileNames) {
        if (fileNames === undefined) return;
        
          var fileName = fileNames[0];

          fs.readFile(fileName, 'utf-8', function (err, data) {
            console.log("Data from file: "+data);
            if(err){
              return dialog.showMessageBox({buttons: ["Ok"], type: "error", title: "Error!", message: "An error has occurred loading the events into your calendar."});
            }
            
            try{
              allEvents = JSON.parse(data);
            }catch(err){
              return dialog.showMessageBox({type: "error", buttons: ["Ok"], title: "Error!", message: "An error has occurred loading the events into your calendar."});
            }
            for (var i = 0, len = allEvents.length; i < len; i++){
                db.events.save(allEvents[i]);
            } 
            dialog.showMessageBox({type: "none", title: "Success!", buttons: ["Ok"], message: "The contents of that file are now loaded into your calendar."});
            mainWindow.reload();
          });
     }); 
  }

  function saveFile(){
      console.log("Save");
      dialog.showSaveDialog({ 
          filters: [
            { 
              name: 'calendar', 
              extensions: ['kevsCal'] 
            }
      ]}, function (fileName) {
         if (fileName === undefined) return;
        fs.writeFile(fileName, JSON.stringify(db.events.find()), (err) => {
          if (err) {
            return dialog.showMessageBox({type: "error", title: "Error!", buttons: ["Ok"], message: "Something went wrong!"});
          }
          return dialog.showMessageBox({type: "none", title: "Success!", buttons: ["Ok"], message: "All events have been saved into the calendar file."});
        });
      });
  }

  function clearCalendar(){
      db.events.remove();
      global.db = db.connect('./db', ['events']);
      dialog.showMessageBox({type: "none", title: "Success!", buttons: ["Ok"], message: "You have successfully cleared your calendar... Something about that feels rewarding..."});
      mainWindow.reload();
  }

  function changeView(view){
      console.log("Change view to " + view);
      if(view=="desktop"){
        mainWindow.maximize();
      }else if(view=="tablet"){
        mainWindow.setSize(800,1024);
      }else{
        mainWindow.setSize(375,667);
      }
  }
};

module.exports = constructorMethod;