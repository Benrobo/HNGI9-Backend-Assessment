const { Configuration, OpenAIApi } = require("openai");
const dotenv = require("dotenv")

// configure .env file
dotenv.config()

const configuration = new Configuration({
    apiKey: process.env.OPENAPI_KEY
});
const openai = new OpenAIApi(configuration);

async function predictIntent(statement) {
    const response = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: statement || "Multiply 5 by 4 and add 27 to the final result",
        temperature: 0,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0.2,
        presence_penalty: 0,
    });

    return response.data;
}

module.exports = predictIntent
