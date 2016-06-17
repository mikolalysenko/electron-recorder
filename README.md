# electron-recorder
A streaming video recorder using [electron](https://github.com/electron/electron) and [ffmpeg](http://ffmpeg.org/).

# Example
Here is a simple page showing how to use `electron-recorder` to create a movie:

```html
<html>
  <body>
    <h1>Test Movie</h1>
    <script>
      const electron = require('electron')
      const createVideoRecorder = require('electron-recorder')

      // First we grab a reference to the current window object
      const win = electron.remote.getCurrentWindow()

      // The size of the animation is the same as the size of the window
      win.setSize(200, 200)

      // Here we create recorder object
      const video = createVideoRecorder(win, {
        fps: 60,
        output: 'test.mp4'
      })

      let frameCount = 360
      function renderFrame () {
        // Here is where we render the movie (we just make the text rotate)
        Object.assign(document.querySelector('h1').style, {
          'width': 100,
          'margin-left': 50,
          'margin-top': 50,
          '-webkit-transform': 'rotate(' + frameCount + 'deg)'
        })

        // If we still have frames left, then take a snapshot and schedule
        // another frame
        if (--frameCount > 0) {
          video.frame(renderFrame)
        } else {
          // Otherwise, movie is over and we save the snapshot to file
          video.end()
          win.close()
        }
      }

      renderFrame()
    </script>
  </body>
</html>
```

Suppose that this was saved to a file called `index.html`.  Then we could run this using electron with the following command:

```
electron index.html
```

And once it is done, we should get the following:

[![Result](http://img.youtube.com/vi/1p14KdH0jn8/0.jpg)](https://youtu.be/1p14KdH0jn8)

# Install

While electron-recorder does not have any JavaScript dependencies, it does have system requirements that you need to configure.

First, you need to install electron.  Instructions for this can be found on the [electron web page](http://electron.atom.io/), or you can install via npm using the `electron-prebuild` package:

```
npm i electron-prebuild
```

Then you need to install ffmpeg on your system and put it on your path.  Instructions can be found on the [ffmpeg homepage](http://ffmpeg.org/), or if you are on a debian Linux system you can use apt:

```
apt-get install ffmpeg
```

Finally, after all that is done you can install the module:

```sh
npm i electron-recorder
```

And that's it!

# API

#### `var recorder = require('electron-recorder')(window[, options])`
This creates a new recorder instance.  It takes two arguments:

* `window` which is a reference to the window object in which we are recording
* `options` which is a dictionary of optional configuration parameters.
    + `ffmpeg` a string representing the path to the ffmpeg executable (default `ffmpeg`)
    + `fps` the frame rate of the video (default `60`)
    + `output` the name of the file to write the output to.  If not specified, then output is streamed (note that some movie formats like AVI and MP4 do not support streaming output)
    + `format` The type of the output format (default `matroska`)

**Returns** A new video recorder instance

#### `recorder.frame([next(err)])`
Takes a snapshot of the current browser window and appends it to the movie.

* `next(err)` is a callback which is executed once the frame is successfully recorded.

#### `recorder.end()`
Ends the video recording and saves the results

#### `recorder.log`
A streaming text log of the output of `ffmpeg` as it is encoding.

#### `recorder.stream`
If no output was specified, then the `.stream` property of the recorder is a readable stream object containing the encoded movie.

# FAQ

#### Can this be run headless?
Sort of.  On linux, you can use xvfb to redirect the display to an offscreen buffer.  You can also try using [`electron-spawn`](https://github.com/maxogden/electron-spawn).  Better options right now are limited because electron does not yet support headless rendering natively, but this may change in the future.

#### Why use this instead of `ccapture.js`?
`electron-recorder` records your whole display and is streaming.  It is geared to recording longer animations and requires specially instrumenting your code.  `ccapture.js` runs in your browser and has no dependencies, but also shims a bunch of functions to emulate timing and globs all your frames at once in your tab's memory which can cause slow downs or crashes on very long movies.  Also it only supports export to a limited number of formats, while `electron-recorder` can export to anything ffmpeg supports.

#### What happens if I touch my window during the animation?
Stuff will probably break.  Don't do that!

# License
(c) 2016 Mikola Lysenko. MIT License
