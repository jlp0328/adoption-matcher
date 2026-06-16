import fs from "fs/promises";
import * as cheerio from "cheerio";

import { generateDog } from "@/scripts/generateDogsFromProfile";

type AvailableDog = {
  name: string;
  url: string;
};

async function fetchProfileText(
  url: string
): Promise<string> {
  const html = await fetch(url).then((r) =>
    r.text()
  );

  const $ = cheerio.load(html);

  const profile =
    $(".dog-description").text().trim();

  if (!profile) {
    throw new Error(
      `No .dog-description found for ${url}`
    );
  }

  return profile;
}

async function main() {
  const availableDogs: AvailableDog[] =
    JSON.parse(
      await fs.readFile(
        "data/dogs/availableDogs.json",
        "utf8"
      )
    );

  const dogs = [];

  for (const dog of availableDogs) {
    try {
      console.log(
        `Processing ${dog.name}...`
      );

      const profileText =
        await fetchProfileText(dog.url);

      const generatedDog =
        await generateDog(profileText);

      generatedDog.id =
        generatedDog.id ||
        dog.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-");

      dogs.push(generatedDog);

      await fs.writeFile(
        "data/dogs/dogs.json",
        JSON.stringify(
          dogs,
          null,
          2
        )
      );

      console.log(
        `✓ Generated ${dog.name}`
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 2000)
      );
    } catch (error) {
      console.error(
        `✗ Failed ${dog.name}`,
        error
      );
    }
  }

  console.log(
    `Finished. Generated ${dogs.length} dogs.`
  );
}

main().catch(console.error);