const cutter = require("mp3-cutter");

/**
 * Cut audio given a start until the expect end.
 * @param { string } audioSrc needs exist on './audio' folder
 * @param { number } start value in seconds.
 * @param { number } end value in seconds. (if don't pass any value, will get duration of the audio)
 */
function audioCutter(audioSrc, start, end) {
    if (!audioSrc && !start) {
        throw Error("Missing parameters");
    }

    if (end && start > end) {
        [start, end] = [end, start];
    }

    const options = {
        src: `./audio/${audioSrc}`,
        target: `./cutted/cut-${audioSrc}`,
        start: start,
    };

    if (end) {
        options.end = end;
    }

    cutter.cut(options);
}

exports.audioCutter = audioCutter;