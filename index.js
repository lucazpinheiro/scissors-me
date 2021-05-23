const yt = require('./ytDownloader')
const { audioCutter } = require('./cutter');

const url = 'https://www.youtube.com/watch?v=P6EFy2cADNM'

const [, id] = url.split('?v=')


yt.getVideo(id, audioCutter, 5)

