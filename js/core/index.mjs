import GrayScaleFilter from "./GrayScaleFilter.mjs";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const grayScaleFilter = new GrayScaleFilter();

window.onload = () => {
  (async () => {
    await grayScaleFilter.applyFilter("assets/img2.jpg", ctx);
  })();
};
