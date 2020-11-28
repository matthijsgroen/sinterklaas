// eslint-env node
const { app, BrowserWindow, Menu, powerSaveBlocker } = require("electron");
const express = require("express");
const path = require("path");
const isDev = require("electron-is-dev");

function createWindow() {
  const win = new BrowserWindow({ width: 1280, height: 720 });
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
}

function createRemotePlayWindow() {
  // https://gist.github.com/maximilian-lindsey/a446a7ee87838a62099d
  const { networkInterfaces } = require("os");

  const nets = networkInterfaces();
  const result = Object.values(nets).reduce(
    (acc, addresses) =>
      acc.concat(
        addresses.filter(addr => addr.family === "IPv4" && !addr.internal)
      ),
    []
  );
  const address = result[0].address;

  const server = express();
  server.set("port", process.env.PORT || 8080);
  server.use(express.static(path.join(__dirname, "../build/")));
  const instance = server.listen(server.get("port"));
  const id = powerSaveBlocker.start("prevent-app-suspension");

  const win = new BrowserWindow({ width: 800, height: 420, resizable: false });
  win.loadURL(
    isDev
      ? `http://localhost:3000/remote-play.html?address=${address}`
      : `file://${path.join(
          __dirname,
          `../build/remote-play.html?address=${address}`
        )}`
  );
  win.on("close", () => {
    instance.close();
    powerSaveBlocker.stop(id);
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const isMac = process.platform === "darwin";
const template = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideothers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" },
          ],
        },
      ]
    : []),
  // { role: 'fileMenu' }
  ...(isMac
    ? []
    : [
        {
          label: "File",
          submenu: [isMac ? { role: "close" } : { role: "quit" }],
        },
      ]),
  // { role: 'viewMenu' }
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forcereload" },
      { role: "toggledevtools" },
      { type: "separator" },
      { role: "resetzoom" },
      { role: "zoomin" },
      { role: "zoomout" },
      { type: "separator" },
      { role: "togglefullscreen" },
      { type: "separator" },
      {
        label: "Play remote",
        click: async () => {
          createRemotePlayWindow();
        },
      },
    ],
  },
  // { role: 'windowMenu' }
  {
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      ...(isMac
        ? [
            { type: "separator" },
            { role: "front" },
            { type: "separator" },
            { role: "window" },
          ]
        : [{ role: "close" }]),
    ],
  },
  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal("https://electronjs.org");
        },
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
