import Color from "./Color.mjs";

export default class GrayScaleFilter {
  /**
   * generate gray color based on RGB color
   * @param {Number} r red
   * @param {Number} g green
   * @param {Number} b blue
   */
  #generateGrayColorBasedOnRGBColor(r, g, b) {
    const intensity = Color.getColorIntensity(r, g, b);

    return {
      array: [intensity, intensity, intensity],
      color: `rgb(${intensity}, ${intensity}, ${intensity})`,
    };
  }

  /**
   * get image data pixels
   * @param {String} imageUrl image location
   * @returns {Promise<ImageData>}
   */
  async #getImageData(imageUrl) {
    const img = new Image();
    img.src = imageUrl;

    return await new Promise((resolve) => {
      const canvas = document.createElement("canvas");

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        /**
         * @type {CanvasRenderingContext2D}
         */
        const context = canvas.getContext("2d");
        context.drawImage(img, 0, 0, img.width, img.height);

        const data = context.getImageData(0, 0, img.width, img.height);

        resolve({
          data: data.data,
          height: img.height,
          width: img.width,
        });
      };
    });
  }

  /**
   * apply filter
   * @param {String} image image location
   * @param {Number} width width of image
   * @param {Number} height height of image
   * @param {CanvasRenderingContext2D} context 2d context to apply effect
   */
  async applyFilter(image, context) {
    const {
      data: imageColors,
      width: imageWidth,
      height: imageHeight,
    } = await this.#getImageData(image);

    context.canvas.width = imageWidth;
    context.canvas.height = imageHeight;

    await new Promise((resolve) => {
      /**
       * array of colors
       * @type {Array<Array<Number>>}
       */
      const rgbColorsList = [];

      /**
       * [r, g, b]
       * @type {Array<Number>}
       */
      let rgb = [];

      // group colors by rgb [r, g, b]
      for (let i = 0; i < imageColors.length; i++) {
        const colorPart = imageColors[i];

        if (rgb.length < 4) {
          rgb.push(colorPart);
        } else {
          rgbColorsList.push(rgb);
          rgb = [colorPart];
        }
      }

      let currentRow = -1;

      for (let i = 0; i < rgbColorsList.length; i++) {
        if (i % imageWidth === 0) {
          currentRow++;
        }

        let color = rgbColorsList[i];
        const grayScaleColor = this.#generateGrayColorBasedOnRGBColor(...color);

        context.fillStyle = grayScaleColor.color;
        context.fillRect(i % imageWidth, currentRow, 1, 1);
      }

      resolve();
    });
  }
}
