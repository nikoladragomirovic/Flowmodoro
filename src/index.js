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
  let isAlwaysOnTop = false;

  const mainWindow = new BrowserWindow({
    width: 200,
    height: 200,
    icon: path.join(__dirname, "icon.icns"),
    resizable: false,
    titleBarStyle: "hidden",
    alwaysOnTop: isAlwaysOnTop,
    webPreferences: {},
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));
  mainWindow.setAlwaysOnTop(isAlwaysOnTop);

  const template = [
    {
      label: "File",
      submenu: [
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
          label: "Full Screen",
          accelerator: "CmdOrCtrl+F",
          click(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          },
        },
      ],
    },
    {
      label: "Window",
      submenu: [
        {
          label: "Always on Top",
          accelerator: "CmdOrCtrl+T",
          type: "checkbox",
          click(item) {
            isAlwaysOnTop = item.checked;
            mainWindow.setAlwaysOnTop(isAlwaysOnTop);
          },
        },
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
      label: "Rest",
      submenu: [
        {
          label: "Short",
          type: "radio",
          accelerator: "CmdOrCtrl+S",
          click() {
            const preference = "short";
            writePreferenceToFile(preference);
          },
        },
        {
          label: "Default",
          type: "radio",
          accelerator: "CmdOrCtrl+D",
          checked: true,
          click() {
            const preference = "default";
            writePreferenceToFile(preference);
          },
        },
        {
          label: "Long",
          type: "radio",
          accelerator: "CmdOrCtrl+L",
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
  const iconPath = path.join(__dirname, "build", "icon.png");
  const icon = nativeImage.createFromPath(iconPath);
  app.dock.setIcon(icon);
  app.dock.bounce();
  createWindow();
});

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    const iconPath = path.join(__dirname, "build", "icon.png");
    const icon = nativeImage.createFromPath(iconPath);
    app.dock.setIcon(icon);
    app.dock.bounce();
    createWindow();
  }
});
