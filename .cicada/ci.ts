import { Job, Pipeline } from "https://deno.land/x/cicada@v0.1.50/mod.ts";

const job = new Job({
  name: "CI",
  image: "node:18",
  cacheDirectories: ["node_modules"],
  steps: [
    {
      name: "Install dependencies",
      run: "yarn install",
    },
    {
      name: "Run tests",
      run: "yarn test",
    },
  ],
});

export default new Pipeline(
  [job],
  {
    on: {
      pullRequest: ["main"],
      push: ["main"],
    },
  },
);
