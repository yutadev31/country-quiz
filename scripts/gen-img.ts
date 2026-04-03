import fs from "node:fs";
import * as d3 from "d3";
import sharp from "sharp";

const WIDTH = 800;
const HEIGHT = 600;

// 出力先
const OUT_DIR = "./public/maps";

// GeoJSON読み込み
const geojson = JSON.parse(fs.readFileSync("./world.geojson", "utf-8"));

// ディレクトリ作成
["./public", OUT_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ファイル名安全化
function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9]/g, "_");
}

function getName(feature: any) {
  return (
    feature.properties.ISO_A2 !== "-99"
      ? feature.properties.ISO_A2
      : feature.properties.ADM0_A3_JP
  ).toLowerCase();
}

// SVG生成
function buildSVG(projection: d3.GeoProjection, highlightName: string) {
  const pathGen = d3.geoPath().projection(projection);

  const paths = geojson.features
    .map((feature: any) => {
      const name = getName(feature);
      const d = pathGen(feature);

      const fill = name === highlightName ? "#ff4d4f" : "#e0e0e0";

      return `<path d="${d}" fill="${fill}" stroke="#999" stroke-width="0.5"/>`;
    })
    .join("");

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
    <rect width="100%" height="100%" fill="#ffffff"/>
    ${paths}
  </svg>
  `;
}

// ズームprojection（安定版）
function createZoomProjection(feature: any) {
  return d3.geoMercator().fitExtent(
    [
      [180, 180],
      [WIDTH - 180, HEIGHT - 180],
    ],
    feature,
  );
}

// PNG出力
async function exportPNG(svg: string, filepath: string) {
  await sharp(Buffer.from(svg)).png().toFile(filepath);
}

// メイン処理
async function run() {
  for (const feature of geojson.features) {
    const name = getName(feature);
    const fileName = safeName(name);

    console.log(`Generating: ${name}`);

    const projection = createZoomProjection(feature);
    const svg = buildSVG(projection, name);

    await exportPNG(svg, `${OUT_DIR}/${fileName}.png`);
  }

  console.log("✅ Done!");
}

run();
