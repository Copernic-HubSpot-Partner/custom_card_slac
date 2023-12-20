import React, {useEffect, useState} from "react";
import {
  Divider,
  Link,
  Button,
  Text,
  Input,
  Flex,
  hubspot,
} from "@hubspot/ui-extensions";
import {Channel} from "./components/Channel";

// Define the extension to be run within the Hubspot CRM
hubspot.extend(({ context, runServerlessFunction, actions }) => (
  <Extension
    context={context}
    runServerless={runServerlessFunction}
    sendAlert={actions.addAlert}
  />
));


// Define the Extension component, taking in runServerless, context, & sendAlert as props
const Extension = ({ context, runServerless, sendAlert }) => {
  const [text, setText] = useState("");
  const [dealId, setDealId] = useState();
  const [messages, setMessages] = useState([]);

  // Call serverless function to execute with parameters.
  // The `myFunc` function name is configured inside `serverless.json`
  const createChannel = async () => {
    runServerless({
      name: "ChannelCreation",
      parameters: {text: text},
      propertiesToSend: ['hs_object_id', 'dealname', 'slack_channel_id', 'hubspot_owner_id']
    }).then((resp) => {
      sendAlert({message: resp.response.message, type: resp.response.type})
    });
  };

  const messageUpdate = () => {
    runServerless({
      name: "messageUpdate", parameters: { text: text } , propertiesToSend: ['hs_object_id', 'dealname', 'slack_channel_id']
    }).then((resp) => {
      setMessages(resp.response)
      console.log(resp.response, "resp.response")
    });
  };

useEffect(() => {
  messageUpdate();
}, []);


  return (
    <>
      <Text>
        <Text format={{ fontWeight: "bold" }}>
          Créer un salon Slack
        </Text>
      </Text>
      <Flex direction="row" align="end" gap="small">
        <Button type="submit" onClick={createChannel}>
          Créer
        </Button>
        <Button type="submit" onClick={messageUpdate}>
          Get Messages
        </Button>
      </Flex>
      <Divider />
      <Channel messages={messages} />
    </>
  );
};
