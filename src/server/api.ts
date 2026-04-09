import { Elysia, t } from "elysia";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db, purchases, users } from "@/lib/db";

export const api = new Elysia({ prefix: "/api" })
	.onRequest(({ request }) => {
		console.log(`[API] \(${request.method} \)${request.url}`);
	})
	.onError(({ code, error, path }) => {
		console.log(`[API ERROR] \(${code} on \)${path}:`, error);
	})
	.get("/health", () => ({
		status: "ok",
		timestamp: new Date().toISOString(),
	}))
  .get("/me", async ({request, set}) => {
     const session = await auth.api.getSession({
      headers: request.headers
     })
     
     if(!session) {
      set.status = 401;
      return { error: "Unauthorized"};
     }

     return {user: session.user};
  })
  .get("/payments/status", async ({request, set}) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if(!session) {
      set.status = 401;
      return { error: "Unauthorized" };
    }
    
    const purchase = await db 
    .select()
    .from(purchases)
    .where(eq(purchases.userId, session.user.id))
    .limit(1);

    return {
      userId: session.user.id,
      purchase: purchase[0] ?? null,
    };
  });

  export type Api = typeof api;

