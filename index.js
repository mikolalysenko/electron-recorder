var spawn = require('child_process').spawn

module.exports = createMovieRecorderStream

function createMovieRecorderStream (win, options_) {
  var options = options_ || {}

  if (!win) {
    throw new Error('electron-animator: you must specify a BrowserWindow')
  }

  var ffmpegPath = options.ffmpeg || 'ffmpeg'
  var fps = options.fps || 60

  var args = [
    '-y',
    '-f', 'image2pipe',
    '-r', '' + (+fps),
    '-i', '-',
    '-c:v', 'libvpx',
    '-auto-alt-ref', '0',
    '-pix_fmt', 'yuva420p',
    '-metadata:s:v:0', 'alpha_mode="1"'
  ]

  var outFile = options.output

  if ('format' in options) {
    args.push('-f', options.format)
  } else if (!outFile) {
    args.push('-f', 'matroska')
  }

  if (outFile) {
    args.push(outFile)
  } else {
    args.push('-')
  }

  var ffmpeg = spawn(ffmpegPath, args)

  function appendFrame (next) {
    // This is dumb, but sometimes electron's capture fails silently and returns
    // an empty buffer instead of an image.  When this happens we can retry and
    // usually it works the second time.
    function tryCapture () {
      try {
        win.capturePage(function (image) {
          var png = image.toPNG()

          if (png.length === 0) {
            setTimeout(tryCapture, 10)
          } else {
            ffmpeg.stdin.write(png, function (err) {
              next(err)
            })
          }
        })
      } catch (err) {
        next(err)
      }
    }
    tryCapture()
  }

  function endMovie () {
    ffmpeg.stdin.end()
  }

  var result = {
    frame: appendFrame,
    end: endMovie,
    log: ffmpeg.stderr
  }

  if (!outFile) {
    result.stream = ffmpeg.stdout
  }

  return result
}
