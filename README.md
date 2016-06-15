# electron-recorder
A streaming video recorder using [electron](https://github.com/electron/electron) and [ffmpeg](http://ffmpeg.org/).

# Example

```html
<html>
  <body>
    <h1>Test Movie</h1>
    <script>
      const electron = require('electron')
      const createVideoRecorder = require('../index')

      const win = electron.remote.getCurrentWindow()

      win.setSize(200, 200)

      const video = createVideoRecorder(win, {
        fps: 60,
        output: 'test.mp4'
      })

      let frameCount = 360
      function renderFrame () {
        const tag = document.querySelector('h1')

        Object.assign(tag.style, {
          'width': 100,
          'margin-left': 50,
          'margin-top': 50,
          '-webkit-transform': 'rotate(' + frameCount + 'deg)'
        })

        if (--frameCount > 0) {
          video.frame(renderFrame)
        } else {
          video.end()
          win.close()
        }
      }

      renderFrame()
    </script>
  </body>
</html>
```

<video src="example/test.mp4" />

# Install

First, you need to install electron.

Then you need to install ffmpeg on your system and put it on your path.

Then you can install this module,

```sh
npm i -S electron-recorder
```

# API

#### `var recorder = require('electron-recorder')(window[, options])`

#### `recorder.frame([next])`

#### `recorder.end()`

#### `recorder.err`

#### `recorder.stream`

# License
(c) 2016 Mikola Lysenko. MIT License
