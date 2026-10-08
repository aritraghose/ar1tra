import type { APIRoute } from "astro";

// Rendered per-request so we can read Cloudflare's request.cf geo/network data.
export const prerender = false;

// Subset of Cloudflare's IncomingRequestCfProperties that we expose.
interface CfProperties {
	city?: string;
	region?: string;
	country?: string;
	timezone?: string;
	asn?: number;
	asOrganization?: string;
	colo?: string;
	httpProtocol?: string;
	tlsVersion?: string;
	clientTcpRtt?: number;
}

export const GET: APIRoute = ({ request }) => {
	const cf = (request as Request & { cf?: CfProperties }).cf ?? {};

	// Only reflect the visitor's own coarse data back to them. Never the IP, never logged.
	const body = {
		city: cf.city ?? null,
		region: cf.region ?? null,
		country: cf.country ?? null,
		timezone: cf.timezone ?? null,
		asn: cf.asn ?? null,
		asOrganization: cf.asOrganization ?? null,
		colo: cf.colo ?? null,
		httpProtocol: cf.httpProtocol ?? null,
		tlsVersion: cf.tlsVersion ?? null,
		rtt: cf.clientTcpRtt ?? null,
	};

	return new Response(JSON.stringify(body), {
		headers: {
			"Content-Type": "application/json",
			// Per-visitor data: must never be cached by the edge or shared caches.
			"Cache-Control": "private, no-store",
			"CDN-Cache-Control": "no-store",
		},
	});
};
