const durationFormatter = (duration) => {
    duration = Math.floor(duration);
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    return `${hours ? hours + ":" : ""}${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;

}

export default durationFormatter;
