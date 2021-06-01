import { path } from '@ffmpeg-installer/ffmpeg'
import ffmpeg, { FfmpegCommandOptions } from 'fluent-ffmpeg'
ffmpeg.setFfmpegPath(path);

import { existsSync, mkdirSync, unlink } from 'fs'
import ytdl from 'ytdl-core'
import { cut } from 'mp3-cutter'

export class ScissorsMe {
  private URL: string;
  private startTime: Number;
  private endTime: Number | undefined;
  private _tempPath: string = `${__dirname}/temp`;
  private _memesPath: string = `${__dirname}/memes_audio`;

  constructor(url: string, start: Number = 0, end?: Number) {
    if (!url) {
      throw new Error("Missing `URL` parameter.");
    }

    this.URL = url.split("?v=")[1];
    this.startTime = start;
    this.endTime = end;

    this.makeDirectories();
    this.getVideo();
  }

  makeDirectories() {
    if (!existsSync(this._tempPath)) {
      mkdirSync(this._tempPath);
    }

    if (!existsSync(this._memesPath)) {
      mkdirSync(this._memesPath);
    }
  }

  async getVideo() {
    try {
      let stream: any = await ytdl(this.URL, {
        quality: "highestaudio",
      });

      this.saveAudio(stream);
    } catch (error) {
      console.error(error);
    }
  }

  async saveAudio(stream: FfmpegCommandOptions) {
    await ffmpeg(stream)
      .audioBitrate(128)
      .save(`${this._tempPath}/${this.URL}.mp3`)
      .on('end', () => {
        this.audioCutter();
      });
  }

  /**
   * Cut audio given a start and end time.
   */
  audioCutter() {
    if (this.endTime && this.startTime > this.endTime) {
      [this.startTime, this.endTime] = [this.endTime, this.startTime];
    }

    const options = {
      src: `${this._tempPath}/${this.URL}.mp3`,
      target: `${this._memesPath}/${this.URL}.mp3`,
      start: this.startTime,
    };

    if (this.endTime) {
      Object.defineProperty(options, 'end', { value: this.endTime })
    }

    cut(options);
    unlink(options.src, (err) => { if (err) throw err });
  }
}