/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const { Configuration, OpenAIApi } = require("openai");

exports.handler = async function (event) {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  console.log(`EVENT BODY: ${event.body}`);

  const configuration = new Configuration({
    organization: "org-rBKurYqN8l6f65aLCxvoE6XG",
    apiKey: "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",
  });

  const openai = new OpenAIApi(configuration);

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "you are an english teacher, and you are evaluating an essay written by a student who is learning english as a second language. Please focus on how the students can improve their writing skills. for every essay, please write a score between 1 and 10.",
      },
      { role: "user", content: event.body },
    ],
  });

  return {
    statusCode: 200,
    //  Uncomment below to enable CORS requests
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },

    body: JSON.stringify(response.data["choices"][0]["message"]["content"]),
  };
};
