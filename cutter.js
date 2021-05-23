const cutter = require("mp3-cutter");

function cutAudio(audioSrc, start, end) {
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

cutAudio("teste.mp3", 10, 5);
