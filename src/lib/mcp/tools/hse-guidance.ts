import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const guidance: Record<string, string[]> = {
  risk_assessment: [
    "Identify the task, area, people exposed, and normal/non-normal operating conditions.",
    "List hazards with current controls before assigning likelihood and severity.",
    "Prefer elimination, substitution, and engineering controls before administrative controls or PPE.",
    "Record the responsible person, target date, and verification method for each action.",
  ],
  incident: [
    "Secure the scene and provide immediate medical response if needed.",
    "Record facts, witnesses, equipment, time, location, and environmental conditions.",
    "Separate immediate causes from root causes and avoid assigning blame in the initial record.",
    "Define corrective actions with owners and follow-up verification.",
  ],
  training: [
    "Define learning objectives for the job role and risk exposure.",
    "Capture trainer, participants, topic, evaluation result, and evidence of attendance.",
    "Refresh training after incidents, process changes, role changes, or expired competency periods.",
  ],
  health: [
    "Limit medical details to authorized occupational-health roles.",
    "Record fitness-for-work decisions separately from sensitive clinical findings where possible.",
    "Track periodic examination dates and exposure-based surveillance requirements.",
  ],
};

export default defineTool({
  name: "hse_guidance",
  title: "HSE guidance",
  description: "Provide concise HSE process guidance for risk, incident, training, or health workflows.",
  inputSchema: {
    topic: z
      .enum(["risk_assessment", "incident", "training", "health"])
      .describe("The HSE workflow topic to get guidance for."),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: ({ topic }) => ({
    content: [
      {
        type: "text",
        text: guidance[topic].map((item, index) => `${index + 1}. ${item}`).join("\n"),
      },
    ],
    structuredContent: { topic, guidance: guidance[topic] },
  }),
});