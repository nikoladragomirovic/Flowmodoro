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

const createWindow = (
  width = 200,
  height = 200,
  frame = true,
  style = "hidden"
) => {
  let isAlwaysOnTop = false;

  const mainWindow = new BrowserWindow({
    width: width,
    height: height,
    icon: path.join(__dirname, "build", "icon.png"),
    resizable: false,
    frame: frame,
    titleBarStyle: style,
    alwaysOnTop: isAlwaysOnTop,
    webPreferences: {},
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));
  mainWindow.setAlwaysOnTop(isAlwaysOnTop);

  writePreferenceToFile("default");

  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Full Screen",
          accelerator: "CmdOrCtrl+F",
          click(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          },
        },
        {
          label: "Reload",
          accelerator: "CmdOrCtrl+R",
          click(item, focusedWindow) {
            if (focusedWindow) focusedWindow.reload();
          },
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
      label: "Window",
      submenu: [
        {
          label: "Mode",
          submenu: [
            {
              label: "Compact",
              accelerator: "CmdOrCtrl+C",
              click() {
                createWindow(160, 70, false, "default");
                setTimeout(() => {
                  mainWindow.close();
                }, 10);
              },
            },
            {
              label: "General",
              accelerator: "CmdOrCtrl+G",
              click() {
                createWindow(200, 200, true, "hidden");
                setTimeout(() => {
                  mainWindow.close();
                }, 10);
              },
            },
          ],
        },
        {
          type: "separator",
        },
        {
          label: "Stay on Top",
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
  const iconPath = path.join(__dirname, "build", "icon.icns");
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
