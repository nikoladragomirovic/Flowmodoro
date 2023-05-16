const { app, BrowserWindow, Menu, nativeImage } = require("electron");
const path = require("path");
const fs = require("fs");

console.log(__dirname);

function writePreferenceToFile(preference) {
  const filePath = path.join(__dirname, "preference.txt");
  fs.writeFile(filePath, preference, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Wrote preference "${preference}" to file.`);
    }
  });
}

if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 200,
    height: 200,
    icon: path.join(__dirname, "icon.icns"),
    resizable: false,
    titleBarStyle: "hidden",
    webPreferences: {},
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));

  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "New",
          accelerator: "CmdOrCtrl+N",
          click() {},
        },
        {
          label: "Open",
          accelerator: "CmdOrCtrl+O",
          click() {},
        },
        {
          type: "separator",
        },
        {
          label: "Quit",
          accelerator: "CmdOrCtrl+Q",
          click() {
            app.quit();
          },
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        {
          label: "Cut",
          accelerator: "CmdOrCtrl+X",
          role: "cut",
        },
        {
          label: "Copy",
          accelerator: "CmdOrCtrl+C",
          role: "copy",
        },
        {
          label: "Paste",
          accelerator: "CmdOrCtrl+V",
          role: "paste",
        },
        {
          label: "Select All",
          accelerator: "CmdOrCtrl+A",
          role: "selectall",
        },
      ],
    },
    {
      label: "View",
      submenu: [
        {
          label: "Reload",
          accelerator: "CmdOrCtrl+R",
          click(item, focusedWindow) {
            if (focusedWindow) focusedWindow.reload();
          },
        },
        {
          label: "Toggle Full Screen",
          accelerator: "F11",
          click(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          },
        },
        {
          label: "Toggle Developer Tools",
          accelerator: "CmdOrCtrl+Shift+I",
          click(item, focusedWindow) {
            if (focusedWindow) focusedWindow.webContents.toggleDevTools();
          },
        },
      ],
    },
    {
      label: "Window",
      role: "window",
      submenu: [
        {
          label: "Minimize",
          accelerator: "CmdOrCtrl+M",
          role: "minimize",
        },
        {
          label: "Close",
          accelerator: "CmdOrCtrl+W",
          role: "close",
        },
      ],
    },
    {
      label: "Help",
      role: "help",
      submenu: [
        {
          label: "Learn More",
          click() {
            require("electron").shell.openExternal(
              "https://www.electronjs.org/docs"
            );
          },
        },
      ],
    },
    {
      label: "Rest",
      submenu: [
        {
          label: "Short",
          type: "radio",
          click() {
            const preference = "short";
            writePreferenceToFile(preference);
          },
        },
        {
          label: "Default",
          type: "radio",
          checked: true,
          click() {
            const preference = "default";
            writePreferenceToFile(preference);
          },
        },
        {
          label: "Long",
          type: "radio",
          click() {
            const preference = "long";
            writePreferenceToFile(preference);
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(menu);

  mainWindow.on("leave-full-screen", () => {
    mainWindow.setFullScreenable(true);
  });
};

app.commandLine.appendSwitch("disable-backgrounding-occluded-windows", "true");

app.on("ready", () => {
  const iconPath = path.join(__dirname, "build", "icon.icns");
  const icon = nativeImage.createFromPath(iconPath);
  app.dock.setIcon(icon);
  createWindow();
});

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
