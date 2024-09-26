export function lightenColor(color, percent) {
    const num = parseInt(color.slice(1), 16),
          amt = Math.round(2.55 * percent),
          R = (num >> 16) + amt,
          G = (num >> 8 & 0x00FF) + amt,
          B = (num & 0x0000FF) + amt;
    return `rgb(${(R < 255 ? R < 1 ? 0 : R : 255)},${(G < 255 ? G < 1 ? 0 : G : 255)},${(B < 255 ? B < 1 ? 0 : B : 255)})`;
}
