const dialogflow = require("dialogflow");

const client = new dialogflow.v2.AgentsClient({
  //TODO args
  projectId: "whats-for-dinner-id",
  //TODO args
  keyFilename: "../../secrets/keyfile.json"
});

//TODO args
const formattedParent = client.projectPath("whats-for-dinner-id");

// Handle the operation using the event emitter pattern.
const now = new Date();
client
  .exportAgent({
    parent: formattedParent,
    // TODO args
    agentUri: `gs://whats-for-dinner-id-dialogflow-agent-backup/whats-for-dinner-id_${now.toISOString()}.zip`
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
