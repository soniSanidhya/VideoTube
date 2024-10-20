const sizeFormatter = (size) => {
    if (size < 1024) {
        return size + ' B';
    }
    const kb = size / 1024;
    if (kb < 1024) {
        return kb.toFixed(2) + ' KB';
    }
    const mb = kb / 1024;
    if (mb < 1024) {
        return mb.toFixed(2) + ' MB';
    }
    const gb = mb / 1024;
    return gb.toFixed(2) + ' GB';
}

export default sizeFormatter;