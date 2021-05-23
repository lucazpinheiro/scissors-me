
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

const { existsSync, mkdirSync, unlink } = require("fs");
const ytdl = require("ytdl-core");
const { cut } = require("mp3-cutter");



class ScissorsMe {
  constructor(url, start = 0, end) {
    if (!url) {
      console.error("Missing `URL` parameter.");
    }

    this._id = url.split("?v=")[1];
    this._startTime = start;
    this._endTime = end;
    this._tempPath = `${__dirname}/temp`;
    this._memesPath = `${__dirname}/memes_audio`;


    this.getVideo();
  }

  async getVideo() {
    try {
      let stream = await ytdl(this._id, {
        quality: "highestaudio",
      });

      this.saveAudio(stream);
    } catch (error) {
      console.error(error);
    }
  }

  async saveAudio(stream) {
    if (!existsSync(this._tempPath)) {
      mkdirSync(this._tempPath);
    }

    await ffmpeg(stream)
      .audioBitrate(128)
      .save(`${this._tempPath}/${this._id}.mp3`)
      .on("end", () => {
        this.audioCutter();
      });
  }

  /**
   * Cut audio given a start and end time.
   */
  audioCutter() {
    if (!existsSync(this._memesPath)) {
      mkdirSync(this._memesPath);
    }

    if (this._endTime && this._startTime > this._endTime) {
      [this._startTime, this._endTime] = [this._endTime, this._startTime];
    }

    const options = {
      src: `${this._tempPath}/${this._id}.mp3`,
      target: `${this._memesPath}/${this._id}.mp3`,
      start: this._startTime,
    };

    if (this._endTime) {
      options.end = this._endTime;
    }

    cut(options);
    unlink(options.src, (err) => { if (err) throw err });
  }
}

module.exports = {
  ScissorsMe,
};
