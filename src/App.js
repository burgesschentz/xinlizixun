import React, { useState, useEffect } from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { API } from "aws-amplify";
import {
  Button,
  Flex,
  Heading,
  View,
  withAuthenticator,
} from "@aws-amplify/ui-react";
// import { listNotes } from "./graphql/queries";
import TextareaAutosize from "@mui/base/TextareaAutosize";

import { createQuestion } from "./graphql/mutations";

const App = ({ signOut }) => {
  const [feedback, setFeedback] = useState([]);

  const [showProgressBar, setShowProgressBar] = useState(false);

  async function sendQuestion(event) {
    try {
      setShowProgressBar(true);
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

      const response = await API.post("gpt", "/send/gpt", {
        body: form.get("userInput"), // replace this with attributes you need
      });
      console.log(response);
      setFeedback(response);
    } catch (error) {
      console.error("Error fetching secret data:", error);
    } finally {
      event.target.reset();
      setShowProgressBar(false);
    }
  }

  return (
    <View className="App">
      <Heading level={1}>English Essay</Heading>
      <View as="form" margin="3rem 0" onSubmit={sendQuestion}>
        <Flex direction="column" justifyContent="center">
          <TextareaAutosize
            aria-label="minimum height"
            minRows={3}
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
          {showProgressBar ? <LinearProgress /> : <div />}
        </Flex>
      </View>

      <View margin="3rem 0">{feedback}</View>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
};

export default withAuthenticator(App);
