import { defineMiddleware } from "astro:middleware";

// Same security headers as public/_headers, for pages the Worker renders on request
// (public/_headers only applies to prerendered pages and static assets).
const SECURITY_HEADERS: Record<string, string> = {
	"X-Content-Type-Options": "nosniff",
	"X-Frame-Options": "DENY",
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
	"Strict-Transport-Security": "max-age=31536000",
};

export const onRequest = defineMiddleware(async (_context, next) => {
	let response = await next();
	try {
		for (const [name, value] of Object.entries(SECURITY_HEADERS)) response.headers.set(name, value);
	} catch {
		// Some responses (e.g. Response.redirect) have immutable headers: copy, then set.
		response = new Response(response.body, response);
		for (const [name, value] of Object.entries(SECURITY_HEADERS)) response.headers.set(name, value);
	}
	return response;
});
