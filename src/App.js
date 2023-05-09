import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { API } from "aws-amplify";
import {
  Button,
  Flex,
  Heading,
  Text,
  TextField,
  View,
  withAuthenticator,
} from "@aws-amplify/ui-react";
// import { listNotes } from "./graphql/queries";
import { createQuestion } from "./graphql/mutations";

import { Configuration, OpenAIApi } from "openai";

const App = ({ signOut }) => {
  const [feedback, setFeedback] = useState([]);

  // useEffect(() => {
  //   // fetchNotes();
  // }, []);

  async function fetchNotes() {
    // const apiData = await API.graphql({ query: listNotes });
    // const notesFromAPI = apiData.data.listNotes.items;
    // setNotes(notesFromAPI);
  }

  async function sendQuestion(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const data = {
      content: form.get("userInput"),
      description: "unused",
    };
    await API.graphql({
      query: createQuestion,
      variables: { input: data },
    });

    // const configuration = new Configuration({
    //   organization: "org-rBKurYqN8l6f65aLCxvoE6XG",
    //   apiKey: "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",
    // });
    // // "id": "gpt-3.5-turbo",
    // const openai = new OpenAIApi(configuration);

    // const response = await openai.createChatCompletion({
    //   model: "gpt-3.5-turbo",
    //   messages: [
    //     {
    //       role: "system",
    //       content:
    //         "you are an english teacher, and you are grading an essay written by a student who is learning english as a second language. the student is a native Chinese speaking student.",
    //     },
    //     { role: "user", content: data["content"] },
    //   ],
    // });

    // console.log(response);

    // console.log(response);
    // setFeedback(response.data["choices"][0]["message"]["content"]);
    
    try {
      const response = await API.get('gpt', '/send/gpt');
      console.log(response);
    } catch (error) {
      console.error('Error fetching secret data:', error);
    }

    fetchNotes();
    event.target.reset();
  }

  return (
    <View className="App">
      <Heading level={1}>My Notes App</Heading>
      <View as="form" margin="3rem 0" onSubmit={sendQuestion}>
        <Flex direction="row" justifyContent="center">
          <TextField
            name="userInput"
            placeholder="Paste your essay here"
            label="Essay"
            labelHidden
            variation="quiet"
            required
          />
          <Button type="submit" variation="primary">
            Submit
          </Button>
        </Flex>
      </View>

      <Heading level={2}>Title</Heading>
      <View margin="3rem 0">placeholder {feedback}</View>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
};

export default withAuthenticator(App);
