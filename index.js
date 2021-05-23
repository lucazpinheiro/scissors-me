const yt = require('./ytDownloader')
const { audioCutter } = require('./cutter');

const url = 'https://www.youtube.com/watch?v=P6EFy2cADNM'

yt.getVideo(url)

audioCutter('teste.mp3', 6, 10);
