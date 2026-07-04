import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

function classify(score: number) {
  if (score >= 17) return { level: "critical", action: "Stop work until risk is reduced and approved by management." };
  if (score >= 10) return { level: "high", action: "Add controls and approve before continuing the activity." };
  if (score >= 5) return { level: "medium", action: "Improve controls and monitor implementation." };
  return { level: "low", action: "Maintain current controls and review periodically." };
}

export default defineTool({
  name: "hse_risk_matrix",
  title: "HSE risk matrix",
  description: "Calculate a simple 5x5 HSE risk score from likelihood and severity values.",
  inputSchema: {
    likelihood: z.number().describe("Likelihood rating from 1 to 5."),
    severity: z.number().describe("Severity rating from 1 to 5."),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: ({ likelihood, severity }) => {
    const safeLikelihood = Math.min(5, Math.max(1, Math.round(likelihood)));
    const safeSeverity = Math.min(5, Math.max(1, Math.round(severity)));
    const score = safeLikelihood * safeSeverity;
    const result = classify(score);

    return {
      content: [
        {
          type: "text",
          text: `Risk score: ${score} (${result.level}). ${result.action}`,
        },
      ],
      structuredContent: {
        likelihood: safeLikelihood,
        severity: safeSeverity,
        score,
        level: result.level,
        action: result.action,
      },
    };
  },
});