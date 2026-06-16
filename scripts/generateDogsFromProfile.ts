import OpenAI from "openai";
import { Dog } from "@/types/dogs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateDog(
  profileText: string
): Promise<Dog> {
  console.log("Sending profile to OpenAI...");
  console.log(profileText.substring(0, 500));

  const response = await openai.responses.create({
    model: "gpt-5",
    text: {
      format: {
        type: "json_schema",
        name: "dog_profile",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            breed: { type: "string" },
            ageYears: { type: "number" },
            weightLbs: { type: "number" },
            sex: { type: "string" },
            lifeStage: { type: "string" },
            houseTrained: { type: "boolean" },
            crateTrained: { type: "boolean" },
            energyLevel: { type: "string" },
            goodWithDogs: { type: "string" },
            goodWithCats: { type: "string" },
            goodWithChildren: { type: "string" },
            fenceRequired: { type: "boolean" },
            resourceGuarding: { type: "boolean" },
            separationAnxiety: { type: "string" },
            temperamentTraits: {
              type: "array",
              items: { type: "string" }
            },
            strengths: {
              type: "array",
              items: { type: "string" }
            },
            discussionPoints: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: [
            "id",
            "name",
            "breed",
            "ageYears",
            "weightLbs",
            "sex",
            "lifeStage",
            "houseTrained",
            "crateTrained",
            "energyLevel",
            "goodWithDogs",
            "goodWithCats",
            "goodWithChildren",
            "fenceRequired",
            "resourceGuarding",
            "separationAnxiety",
            "temperamentTraits",
            "strengths",
            "discussionPoints"
          ]
        }
      }
    },
    input: [
      {
        role: "system",
        content: `
You are helping a dog rescue create structured adoption profiles.

Rules:
- Extract facts directly from the profile.
- If unknown, use reasonable defaults.
- Infer temperament traits.
- Infer strengths.
- Infer discussion points for adoption screeners.
- Infer energy level when possible.
- Return valid JSON matching the schema.
`
      },
      {
        role: "user",
        content: profileText
      }
    ]
  });

  return JSON.parse(response.output_text) as Dog;
}