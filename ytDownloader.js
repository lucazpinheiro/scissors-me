const readline = require('readline')
const ytdl = require('ytdl-core')
const ffmpeg = require('fluent-ffmpeg')

const url = 'https://www.youtube.com/watch?v=P6EFy2cADNM'

async function getVideo (url) {
  const [, id] = url.split('?v=')
  let stream = ytdl(id, {
    quality: 'highestaudio',
  });
  
  let start = Date.now();
  ffmpeg(stream)
    .audioBitrate(128)
    .save(`${__dirname}/${id}.mp3`)
    .on('progress', p => {
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`${p.targetSize}kb downloaded`);
    })
    .on('end', () => {
      console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
    });
}


exports.getVideo = getVideo
