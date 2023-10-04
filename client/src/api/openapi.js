import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true, // This is also the default, can be omitted
});

export const sendMsgToOpenAI = async (messages) => {
  console.log("ok");
  const chatCompletion = await openai.chat.completions.create({
    messages: messages,
    model: "gpt-4",
  });
  return chatCompletion.choices;
};
