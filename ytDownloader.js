const ytdl = require('ytdl-core')
const ffmpeg = require('fluent-ffmpeg')

async function getVideo (id, callback) {
  let stream = ytdl(id, {
    quality: 'highestaudio',
  });

  ffmpeg(stream)
    .audioBitrate(128)
    .save(`${__dirname}/temp/${id}.mp3`)
    .on('end', () => {
      callback(id, 5)
    });
}


exports.getVideo = getVideo
