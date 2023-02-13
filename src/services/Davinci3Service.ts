import { CreateCompletionRequest } from "openai";
import { openai } from "../index";

export async function GetDavinciResponse(userPrompt: string) {
  const options: CreateCompletionRequest = {
    model: "text-davinci-003", // GPT model
    prompt: userPrompt,
    temperature: 1,
    max_tokens: 4000, // 4000 max tokens
  };

  try {
    const response = await openai.createCompletion(options);
    let botResponse = "";
    response.data.choices.forEach(({ text }) => {
      botResponse += text;
    });

    return `Chat GPT 🤖\n\n ${botResponse.trim()}`;
  } catch (error: any) {
    console.log(error);
    return `❗ Error: ${error.response.data.error.message}`;
  }
}
