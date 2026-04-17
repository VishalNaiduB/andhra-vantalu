import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";
import { projectId, dataset } from "./sanity/env";

export default defineConfig({
  name: "andhra-vantalu",
  title: "Andhra Vantalu",
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
