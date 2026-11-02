import { randomUUID } from "node:crypto";
import { test as base, expect } from "@playwright/test";

/** Every test gets its own sync code, so tests stay isolated without clearing the database. */
export const test = base.extend({
  context: async ({ context, baseURL }, use) => {
    await context.addCookies([
      { name: "sg_profile", value: `e2e-${randomUUID().slice(0, 12)}`, url: baseURL ?? "http://127.0.0.1:3000" },
    ]);
    await use(context);
  },
});

export { expect };
