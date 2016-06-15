# electron-recorder
A streaming video recorder using [electron](https://github.com/electron/electron) and [ffmpeg](http://ffmpeg.org/).

# Example

```html
<html>
  <body>
    <h1>Test</h1>
    <script>
      const electron = require('electron')
      const createRecorder = require('electron-recorder')
      const fs = require('fs')

      // First we create a recorder object
      const recorder = createRecorder(electron.remote.getCurrentWindow(), {
        fps: 30
      })

      // This pipes the output to example.mkv
      // By default movies are saved in the matrosk format
      //  https://en.wikipedia.org/wiki/Matroska
      recorder.stream.pipe(fs.createWriteStream('example.mkv'))

      // Next we implement a function to render a frame of each animation
      let frameCount = 360
      function renderFrame (err) {
        if (err) {
          console.log('error rendering frame: ', err)
          return
        }

        // Here we render the changes to the screen
        const tag = document.querySelector('h1')
        Object.assign(tag.style, {
          '-webkit-transform': 'rotate(' + frameCount + 'deg)'
        })

        // If there are still frames to render, then append a snapshot to the
        // video and schedule another callback
        if (--frameCount > 0) {
          video.frame(renderFrame)
        } else {
          // Otherwise, we end the video and close the window
          video.end()
          electron.remote.getCurrentWindow().close()
        }
      }
      renderFrame()
    </script>
  </body>
</html>
```

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
