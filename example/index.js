const {app, BrowserWindow} = require('electron')

app.on('ready', function () {
  const win = new BrowserWindow({width: 200, height: 200})
  win.loadURL(`file://${__dirname}/index.html`)

  app.on('window-all-closed', () => {
    app.quit()
  })
})
