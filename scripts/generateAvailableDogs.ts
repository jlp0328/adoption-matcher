import fs from "fs/promises";
import path from "path";
import * as cheerio from "cheerio";

async function main() {
  const html = await fetch(
    "https://crisisdogsnc.org/available-dogs/"
  ).then((r) => r.text());

  const $ = cheerio.load(html);

  const dogs = $("a[href*='/dog/']")
    .map((_, el) => ({
      name: $(el).text().trim(),
      url: $(el).attr("href"),
    }))
    .get()
    .filter((d) => d.name.length > 0);

  const outputPath = path.join(
    process.cwd(),
    "data/dogs/availableDogs.json"
  );

  await fs.writeFile(
    outputPath,
    JSON.stringify(dogs, null, 2)
  );

  console.log(`Found ${dogs.length} dogs`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
