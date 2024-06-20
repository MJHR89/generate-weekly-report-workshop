import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
"<ADD THE OPENAI IMPORT STATEMENT>";

// Function definition
export const WeeklyReportFunction = DefineFunction({
  callback_id: "weekly_report",
  title: "generate a weekly update of what happened in Salesforce",
  description: "pulls Salesforce data to generate an appealing weekly report",
  source_file: "functions/weekly_report_function.ts",
  input_parameters: {
    properties: {
      salesforce_data: {
        type: "ADD TYPE HERE",
        description: "salesforce's report flow",
      },
    },
    required: [""],
  },
  output_parameters: {
    properties: {
      summary_report: {
        type: "ADD TYPE HERE",
        description: "An ai summary of the report",
      },
    },
    required: [""],
  },
});

// Function logic
export default SlackFunction(
  "<ADD THE FUNCTION DEFINTION>",
  /*
  client: easily access Slack APIS
  inputs: use the input object to gather information from the previous step
  env: access environment variables
  */
  async ({ inputs, env }) => {
    const SalesforceData = inputs.salesforce_data;
    let AISummary = "";

    try {
      // create an OpenAI instance to easily call OpenAI APIs
      const OPEN_AI = new OpenAI({
        apiKey: "<USE YOUR OPENAI KEYS FROM THE .ENV FILE>",
      });

      const chatCompletion = await OPEN_AI.chat.completions.create({
        messages: [
          {
            "role": "system",
            "content":
              `summarize the text provided to sound like a report and answer following the structure below for each item. Note that the following template format is mandatory, and you need to interpret the h2 tags. If there's no data on a specific section, do not add the section. If there's no data in a field, do not add the empty field for that item.
              
              📌 What's relevant
              Provide a small summary of what happened during the week, that's relevant and sounds like a report.
              
              🎯 Opportunities update

              Opportunity:
              Probability:
              Amount:
              
              📅 Events Update
              
              Event:
              Description:
              Date

              💼 Tasks
              
              Task:
              Priority:
              Status:
              Due date:
              `,
          },
          { "role": "user", "content": `<USE THE SALESFORCE DATA VARIABLE>` },
        ],
        model: "gpt-3.5-turbo",
      });
      // Get the text from the API response object
      AISummary = chatCompletion.choices[0].message.content ?? "null";
    } catch (error) {
      console.error("trying: OPEN_AI.chat.completions.create", error);
    }

    return {
      outputs: {
        summary_report: "<RETURN THE AI GENERATED SUMMARY >",
      },
    };
  },
);
