import { openai } from "./../index";
import { CreateImageRequest } from "openai";

export async function GetDalleResponse(userPrompt: string) {
  const options: CreateImageRequest = {
    prompt: userPrompt, // Image description
    n: 1, // Number of images to generate
    size: "1024x1024", // Image size
  };

  try {
    const response = await openai.createImage(options);
    return response.data.data[0].url;
  } catch (error: any) {
    return `❗ Error: ${error.response.data.error.message}`;
  }
}
