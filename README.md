# electron-recorder
Records movies using [electron](https://github.com/electron/electron).

# Example

```html
<html>
  <body>
    <h1>Test</h1>
    <script>
      const electron = require('electron')
      const createRecorder = require('electron-recorder')

      const recorder = createRecorder({
        fps: 30,
        output: 'test.mp4',
        window: electron.remote.getCurrentWindow()
      })

      let frameCount = 360
      function renderFrame () {
        const tag = document.querySelector('h1')

        Object.assign(tag.style, {
          '-webkit-transform': 'rotate(' + frameCount + 'deg)'
        })

        if (--frameCount > 0) {
          video.frame(renderFrame)
        } else {
          video.end()
          electron.remote.getCurrentWindow().close()
        }
      }

      renderFrame()
    </script>
  </body>
</html>
```

# API

## `var recorder = require('electron-recorder')()`

## `recorder.frame([next])`

## `recorder.end()`

## `recorder.err`

## `recorder.stream`

# License
(c) 2016 Mikola Lysenko. MIT License
