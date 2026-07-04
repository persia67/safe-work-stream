import { defineMcp } from "@lovable.dev/mcp-js";
import appInfoTool from "./tools/app-info";
import hseGuidanceTool from "./tools/hse-guidance";
import riskMatrixTool from "./tools/risk-matrix";

export default defineMcp({
  name: "hse-management-mcp",
  title: "HSE Management MCP",
  version: "0.1.0",
  instructions:
    "Public HSE utility tools for the HSE Management System. This local-first app keeps user records encrypted on device, so these tools do not expose private local data.",
  tools: [appInfoTool, riskMatrixTool, hseGuidanceTool],
});