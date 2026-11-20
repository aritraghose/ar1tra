// Primary profile links, shared by the home page header and the profile card.
export interface ProfileLink {
	label: string;
	href: string;
	/** Open in a new tab. Off for mailto:, which would leave an empty tab behind. */
	newTab: boolean;
}

export const profileLinks: ProfileLink[] = [
	{ label: "Twitter/X", href: "https://x.com/ar1tra", newTab: true },
	{ label: "GitHub", href: "https://github.com/aritraghose", newTab: true },
	{ label: "LinkedIn", href: "https://www.linkedin.com/in/aritraghose/", newTab: true },
	{ label: "Email", href: "mailto:ar1tragh05e9@gmail.com", newTab: false },
	// /cv redirects straight to Google Drive, so it leaves the site like the others.
	{ label: "CV", href: "/cv", newTab: true },
];

/** Spread onto an <a>: target/rel only for links that open a new tab. */
export const linkAttrs = (link: ProfileLink) =>
	link.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {};
