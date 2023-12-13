import * as htmlToImage from "html-to-image";
import { clocks, weather, communication, maps, social } from "./icon-set-recipes";

function getIconHTML() {
  return [clocks, weather, communication, maps, social]
    .map((iconSet) => {
      const innerHTML = iconSet.symbols
        .map((symbol) => {
          let name;
          let style;
          if (typeof symbol === "string") {
            name = symbol;
            style = "outlined";
          } else {
            name = symbol.name;
            style = symbol.style;
          }
          return `<tr class="js-symbol" data-name="${name}" data-style="${style}">
            <td>
              <span class="js-symbol__name">${name}</span>
            </td>
            <td>
              <span
                class='material-symbols-outlined js-symbol__icon'
                data-character="${name}"
                style="
                  background-color: white;
                  color: black;
                  font-variation-settings: 'wght' 700, 'FILL_color' 1;
                "
              >
                ${name}
              </span>
            </td>
            <td class="js-symbol__canvas-container">
            </td>
            <td>
              <span class="js-symbol__luminance"></span>
            </td>
            <td>
              <span class="js-symbol__scaled-luminance"></span>
            </td>
          </tr>`;
        })
        .join("");
      return `<section class="mb-8 js-section" data-section="${iconSet.name}">
      <details>
        <summary>
          <span class="text-2xl font-bold mb-4">${iconSet.name}</span>
        </summary>
        <div class="mt-2 mb-4">
          <button class="js-redraw bg-[khaki] border border-black px-1 py-2 text-xs" data-section="${iconSet.name}">
            Redraw on canvas
          </button>
          <button class="js-generate-images bg-[khaki] border border-black px-1 py-2 text-xs" data-section="${iconSet.name}">
            Get luminance
          </button>
          <button class="js-generate-scale bg-[khaki] border border-black px-1 py-2 text-xs" data-section="${iconSet.name}">
            Scale luminance
          </button>
          <button class="js-export bg-[khaki] border border-black px-1 py-2 text-xs" data-section="${iconSet.name}">
            Export symbol set
          </button>
        </div>
        <div class="mb-4 text-xs">
          <p>
            <span>Minimum luminance: </span>
            <span class="js-minimum-luminance"></span>
          </p>
          <p>
            <span>Maximum luminance: </span>
            <span class="js-maximum-luminance"></span>
          </p>
          <p>
            <span>Export output: </span>
            <textarea class="js-export-output border-1 border-black block w-full h-32"></textarea>
          </p>
        </div>
        <table>
          <thead>
            <tr>
              <th class="text-left font-normal text-xs">Name</th>
              <th class="text-left font-normal text-xs">Icon</th>
              <th class="text-left font-normal text-xs">Canvas</th>
              <th class="text-left font-normal text-xs">Luminance</th>
              <th class="text-left font-normal text-xs">Luminance (scaled)</th>
            </tr>
          </thead>
          <tbody>
            ${innerHTML}
          </tbody>
        </table>
      </details>
    </section>`;
    })
    .join("");
}

function redrawIconsOnCanvas(section) {
  const { symbols } = section;
  Object.values(symbols).forEach((elements) => {
    htmlToImage.toCanvas(elements.icon).then((canvas) => {
      elements.canvasContainer.appendChild(canvas);
      elements.canvas = canvas;
    });
  });
}

function recordLuminanceValues(section) {
  const { symbols } = section;
  Object.entries(symbols).forEach(([name, elements]) => {
    const context = elements.canvas.getContext("2d");
    const imageData = context.getImageData(0, 0, 48, 48);
    const data = imageData.data;
    const chunks = data.reduce((acc, value, index) => {
      const chunkIndex = Math.floor(index / 4);
      if (!acc[chunkIndex]) {
        acc[chunkIndex] = [];
      }
      acc[chunkIndex].push(value);
      return acc;
    }, []);
    const luminanceByPixel = chunks.map(([r, g, b]) => {
      if ([r, g, b].some((channel) => channel >= 128)) {
        return 255;
      } else {
        return 0;
      }
    });
    const averageLuminance = Math.round(
      luminanceByPixel.reduce((acc, value) => acc + value, 0) /
        luminanceByPixel.length
    );
    elements.luminance.textContent = averageLuminance;
  });
}

function scaleLuminanceValues(section) {
  const { symbols, minimumLuminance, maximumLuminance } = section;
  const luminanceValues = Object.values(symbols).map((symbol) =>
    parseFloat(symbol.luminance.textContent)
  );
  const minimumLuminanceValue = Math.min(...luminanceValues);
  const maximumLuminanceValue = Math.max(...luminanceValues);
  minimumLuminance.textContent = minimumLuminanceValue;
  maximumLuminance.textContent = maximumLuminanceValue;

  Object.values(symbols).forEach(({ luminance, scaledLuminance }) => {
    const luminanceValue = parseFloat(luminance.textContent);
    const scaledLuminanceValue =
      (luminanceValue - minimumLuminanceValue) /
      (maximumLuminanceValue - minimumLuminanceValue);
    const projectedLuminanceValue = Math.round(scaledLuminanceValue * 255);
    scaledLuminance.textContent = projectedLuminanceValue;
  });
}

function exportAsSymbolSet(name, section) {
  const sorted = Object.entries(section.symbols)
    .map(([name, symbol]) => {
      const scaledLuminance = parseFloat(symbol.scaledLuminance.textContent);
      const { style } = symbol.element.dataset;
      return {
        name,
        style,
        luminance: scaledLuminance,
      };
    })
    .sort((a, b) => a.luminance - b.luminance);

  section.exportOutput.value = `
import { SymbolSet } from "./symbol-set.js";

export const ${name} = new SymbolSet("${name}", [
  ${sorted
    .map(
      (symbol) =>
        `{ name: "${symbol.name}", luminance: ${symbol.luminance}, style: "${symbol.style}" }`
    )
    .join(",\n  ")}
]);
  `;
}

function initialize() {
  const canvas = document.getElementById("output");
  canvas.innerHTML = getIconHTML();
  const sections = [...document.querySelectorAll(".js-section")].reduce(
    (acc, section) => {
      const name = section.dataset.section;
      const symbols = [...section.querySelectorAll(".js-symbol")].reduce(
        (acc, element) => {
          const name = element
            .querySelector(".js-symbol__name")
            .textContent.trim();
          const icon = element.querySelector(".js-symbol__icon");
          const luminance = element.querySelector(".js-symbol__luminance");
          const scaledLuminance = element.querySelector(
            ".js-symbol__scaled-luminance"
          );
          const canvasContainer = element.querySelector(
            ".js-symbol__canvas-container"
          );
          acc[name] = {
            element,
            icon,
            luminance,
            scaledLuminance,
            canvasContainer,
          };
          return acc;
        },
        {}
      );
      const redrawButton = section.querySelector(
        `.js-redraw[data-section=${name}]`
      );
      const luminanceButton = section.querySelector(
        `.js-generate-images[data-section=${name}]`
      );
      const scaleButton = section.querySelector(
        `.js-generate-scale[data-section=${name}]`
      );
      const exportButton = section.querySelector(
        `.js-export[data-section=${name}]`
      );
      const minimumLuminance = section.querySelector(`.js-minimum-luminance`);
      const maximumLuminance = section.querySelector(`.js-maximum-luminance`);
      const exportOutput = section.querySelector(`.js-export-output`);
      acc[name] = {
        element: section,
        symbols,
        redrawButton,
        luminanceButton,
        scaleButton,
        exportButton,
        minimumLuminance,
        maximumLuminance,
        exportOutput,
      };
      return acc;
    },
    {}
  );

  Object.entries(sections).forEach(([name, section]) => {
    const { redrawButton, luminanceButton, scaleButton, exportButton } =
      section;
    redrawButton.addEventListener("click", () => {
      redrawIconsOnCanvas(section);
    });
    luminanceButton.addEventListener("click", () => {
      recordLuminanceValues(section);
    });
    scaleButton.addEventListener("click", () => {
      scaleLuminanceValues(section);
    });
    exportButton.addEventListener("click", () => {
      exportAsSymbolSet(name, section);
    });
  });
}

document.addEventListener("DOMContentLoaded", initialize);
