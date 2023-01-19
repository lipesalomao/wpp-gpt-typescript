import { GetDalleResponse } from "./services/DalleService";
import { create, Message, Whatsapp } from "venom-bot";
import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv";
import { GetDavinciResponse } from "./services/Davinci3Service";

dotenv.config();

const configuration = new Configuration({
  organization: process.env.ORGANIZATION_ID,
  apiKey: process.env.OPENAI_KEY,
});

export const openai = new OpenAIApi(configuration);

create({
  session: "chat-gpt",
  multidevice: true,
})
  .then((client: Whatsapp) => start(client))
  .catch((err) => {
    console.error(err);
  });

async function commands(client: any, message: any) {
  const iaCommands = {
    davinci3: "/reply",
    dalle: "/imagine",
  };

  let firstWord = message.text.substring(0, message.text.indexOf(" "));

  switch (firstWord) {
    case iaCommands.davinci3:
      const question = message.text.substring(message.text.indexOf(" "));
      await GetDavinciResponse(question)
        .then((response) => {
          client.sendText(
            message.from === process.env.BOT_NUMBER ? message.to : message.from,
            response
          );
        })
        .catch((err) => {
          console.error(err);
        });
      break;

    case iaCommands.dalle:
      const imgDescription = message.text.substring(message.text.indexOf(" "));
      await GetDalleResponse(imgDescription)
        .then((imgUrl) => {
          client.sendImage(
            message.from === process.env.BOT_NUMBER ? message.to : message.from,
            imgUrl,
            imgDescription,
            "Imagem gerada pela IA DALL-E 🤖"
          );
        })
        .catch((err) => {
          console.error(err);
        });
      break;
  }
}

async function start(client: Whatsapp) {
  await client
    .onAnyMessage((message) => commands(client, message))
    .catch((err) => console.error(err));
}
