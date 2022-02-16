export default class Color {
    /**
     * get color intensity
     * @param {Number} r red
     * @param {Number} g green
     * @param {Number} b blue
     * @returns {Number} 0 -> 255
     */
    static getColorIntensity(r, g, b) {
        const intensity = (1 / 3) * (r + g + b);
        const rounded = intensity - (intensity % 1);

        if (rounded > 255) {
            return 255;
        } else if (rounded < 0) {
            return 0;
        }

        return rounded;
    }
}