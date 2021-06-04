import { path } from "@ffmpeg-installer/ffmpeg";
import ffmpeg, { FfmpegCommandOptions } from "fluent-ffmpeg";
ffmpeg.setFfmpegPath(path);

import { existsSync, mkdirSync, unlink } from "fs";
import { Readable } from "stream";
import ytdl from "ytdl-core";
import { cut } from "mp3-cutter";

interface IOptions {
  url: string;
  alias: string;
  start?: Number;
  end?: Number;
}

export class ScissorsMe {
  private options: IOptions;
  private _audioPath: string = `${__dirname}/mp3`;
  private _tmpPath: string = `${__dirname}/tmp`;
  private _srcPath: string;

  constructor(options: IOptions) {
    if (!options.url || !options.alias) {
      throw new Error(`Missing ${options.url ? "ALIAS" : "URL"} parameter.`);
    }

    if (!ytdl.validateURL(options.url)) {
      throw new Error(`Not a valid URL: ${options.url}`);
    }

    this.options = options;
    this._srcPath = `${this._tmpPath}/${options.alias}.mp3`;
    this._downloadAudio();
  }

  private _makeDirectories() {
    if (!existsSync(this._audioPath)) {
      mkdirSync(this._audioPath);
    }

    if (!existsSync(this._tmpPath)) {
      mkdirSync(this._tmpPath);
    }
  }

  private async _downloadAudio() {
    try {
      const stream: Readable = await ytdl(this.options.url, {
        quality: "highestaudio",
      });

      this._saveAudio(stream);
    } catch (error) {
      throw new Error("Erro no download");
    }
  }

  private async _saveAudio(stream: Readable) {
    this._makeDirectories();
    try {
      await ffmpeg(stream)
        .audioBitrate(128)
        .save(this._srcPath)
        .on("end", () => {
          this._audioCutter();
        });
    } catch {
      new Error("Falha ao salvar");
    }
  }

  private _audioCutter() {
    if (!existsSync(this._srcPath)) {
      return;
    }
    
    let { start = 0, end, alias } = this.options;

    if (end && start > end) {
      [start, end] = [end, start];
    }

    const cutOptions = {
      target: `${this._audioPath}/${alias}.mp3`,
      src: this._srcPath,
      start: start,
    };

    if (end) {
      Object.defineProperty(cutOptions, "end", { value: end });
    }

    cut(cutOptions);
    unlink(this._srcPath, (err: any) => {
      if (err) throw err;
    });
  }
}
