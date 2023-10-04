import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // This is also the default, can be omitted
});

export const sendMsgToOpenAI = async (messages) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: messages,
    model: "gpt-4",
  });
  return chatCompletion.choices;
};
