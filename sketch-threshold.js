// declare variables
var character;
var characterIndex;
var fileNamesString;
var fill_color;
var pixel;
var radius;
var selected_image;
var symbols;
var threshold;
var weight;
var weightIndex;

// weights correspond to the amount of 'fill' available in the font
const weights = [
    700,
    600, 
    500,
    400,
    300,
    200,
    100
  ];

// ***** SPECIFY YOUR IMAGE *****
source_image = "images/test-ad.png"

// ***** SPECIFY THE THRESHOLD *****
// pixels that are dark (whose average color is below 
// the threshold value) are rendered with a white as 
// icon on a dark background. pixels that are light (whose
// average color is above the threshold value) are rendered 
// as a colored icon on a white bg.
threshold = 255;

// ****** SPECIFY ICON SET ****** 
// Choose a "theme" of icons. I could create a new set of
// these pretty easily.
fileNamesString = weather;
// fileNamesString = communication;
// fileNamesString = maps;
// fileNamesString = social;

// preload function loads image and array of icons.
function preload() {
  selected_image = loadImage(source_image);
  let fileNamesArray = fileNamesString.split(/\r?\n/);
  symbols = fileNamesArray;
  symbolsMaxIndex = symbols.length - 1;
}

// rendering the image
function setup() {
  console.log("setup");
  noCanvas();
  background(0);
  let w = width / selected_image.width;
  let h = height / selected_image.height;
  selected_image.loadPixels();

  let html = ``;

  for (let j = 0; j < selected_image.height; j++) {
    let rowInnerHtml = ``;
    for (let i = 0; i < selected_image.width; i++) {
      const pixelIndex = (i + j * selected_image.width) * 4;
      const r = selected_image.pixels[pixelIndex + 0];
      const g = selected_image.pixels[pixelIndex + 1];
      const b = selected_image.pixels[pixelIndex + 2];
      const avg = (r + g + b) / 3;
      var color = "rgb(" + r + ", " + g + "," + b + " )";

      // if the color is dark, make the bg dark, and the icon white
       if (avg < threshold) {
        // pick the right stroke weight, light to dark
        weightIndex = floor(map(avg, 0, threshold, 6, 0));
        // pick the right icon, from light to dark
        characterIndex = floor(map(avg, 0, threshold, 0, symbolsMaxIndex));
        // calculate the border-radius. 
        // lighter icons are more circular.
        radius = floor(map(avg, 0, 255, 0, 50)) + "%";
        // create pixel
        character = symbols[characterIndex];
        weight = weights[weightIndex];

        // if pixel is light, icon should be fill_colored. 
        // otherwise, icon outlined should be outlined.
        if (avg > threshold / 2) {
          // should be fill_colored
          fill_color = 1;
          rowInnerHtml += `
            <span class='material-symbols-outlined' 
                  style="background-color: ${color};color: white;font-variation-settings: 'wght' ${weight}, 'FILL_color' ${fill_color}; border-radius: ${radius}"
                  data-character="${characterIndex}">
              ${character}
            </span>
          `
        } else {
          fill_color = 0;
          rowInnerHtml += `
            <span class='material-symbols-outlined' style="background-color: ${color};color: white;font-variation-settings: 'wght' ${weight}, 'FILL_color' ${fill_color}; border-radius: ${radius}"
            data-character="${characterIndex}">
              ${character}
            </span>
          `
        }
       }
      // if the pixel is light, make the bg white, and the icon colored.
      else {
        // same as above; pick the right stroke weight and characteracter
        weightIndex = floor(map(avg, 0, 255, 0, 6));
        characterIndex = floor(map(avg, threshold, 255, 0, symbolsMaxIndex));
        character = symbols[characterIndex];
        weight = weights[weightIndex];
        if (avg < 163) {
          fill_color = 1;
          rowInnerHtml += `
            <span class='material-symbols-outlined' 
                  style="background-color: white;
                         color: ${color};
                         font-variation-settings: 'wght' ${weight}, 'FILL_color' ${fill_color};"
                  data-character="${avg}">
              ${character}
            </span>
          `
        } 
        else if (avg == 255) {
          character = "";
          rowInnerHtml += `
            <span class='material-symbols-outlined' style="background-color: white;color: ${color};font-variation-settings: 'wght' ${weight}, 'FILL_color' ${fill_color};">${character}</span>
          `
        }
        else {
          fill_color = 0;
          rowInnerHtml += `
            <span class='material-symbols-outlined' 
                  style="background-color: white;
                         color: ${color};
                         font-variation-settings: 'wght' ${weight}, 'FILL_color' ${fill_color};"
                  data-character="${avg}">
              ${character}
            </span>
          `
        }
      }

    }
    html += `
      <div class="pixel-row">
        ${rowInnerHtml}
      </div>
    `;
  }

  // add the pixel_row to the page
  document.body.innerHTML = html;

}
