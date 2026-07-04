import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_app_info",
  title: "Get app information",
  description: "Return public information about the HSE Management app and its MCP integration.",
  inputSchema: {},
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: () => ({
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            app: "HSE Management System",
            architecture: "local-first desktop/web app",
            data_access:
              "This public MCP server does not expose encrypted local IndexedDB records. It provides safe HSE utility tools only.",
            available_tools: ["get_app_info", "hse_risk_matrix", "hse_guidance"],
          },
          null,
          2,
        ),
      },
    ],
    structuredContent: {
      app: "HSE Management System",
      architecture: "local-first desktop/web app",
      dataAccess: "safe-public-tools-only",
    },
  }),
});