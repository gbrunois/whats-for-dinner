#!/usr/bin/env node
const argv = require("yargs").argv;
const dialogflow = require("dialogflow");

const projectId = argv.projectId;
const keyFilePath = argv.keyFilePath;
const dest = argv.dest;

const client = new dialogflow.v2.AgentsClient({
  projectId,
  keyFilename: keyFilePath
});

const formattedParent = client.projectPath(projectId);

// Handle the operation using the event emitter pattern.
const now = new Date();
client
  .exportAgent({
    parent: formattedParent,
    agentUri: `${dest}/${projectId}_${now.toISOString()}.zip`
  })
  .then(responses => {
    const [operation, initialApiResponse] = responses;

    // Adding a listener for the "complete" event starts polling for the
    // completion of the operation.
    operation.on("complete", (result, metadata, finalApiResponse) => {
      // doSomethingWith(result);
      console.log("backup completed");
    });

    // Adding a listener for the "error" event handles any errors found during polling.
    operation.on("error", err => {
      console.error("backup failed");
      throw err;
    });
  })
  .catch(err => {
    console.error(err);
  });
