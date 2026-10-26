# Revision 5 — October 26, 2026

Target: GitHub test arena only, https://websitenew.techsavvy.consulting/. Wix, main-domain DNS and email settings are unchanged. Cloudflare files are prepared but not deployed.

## Approved updates

- AI Services is first in the Services menu. New page covers AI user setup, practical guidance, automation and simple custom software, with original responsive graphics. Clearly identified as separately scoped, per-project work, not included in managed IT packages. Homepage growth copy and FAQ repeat that distinction.
- Client Support links to a new Windows/macOS/Linux Level download page. Generic official downloads only; setup keys and enrollment commands remain private.
- Chris Moles's supplied review preserves his opening and final recommendation, omitting only the requested “On the rare occasion” sentence. Longer quotes receive more autoplay reading time; pause/manual/reduced-motion controls remain.
- Homepage blog heading is “A little perspective.” Cards show truthful original publication dates; refreshed articles retain the real update dates inside. Older posts were not falsely backdated to create monthly spacing.
- Explore All Services is removed from navigation and homepage. Its old URL redirects to Managed IT while retaining query/hash in the browser; Cloudflare 301 rules are prepared separately.
- Proactive IT, co-managed/onsite support, relationship wording, backup priorities and recovery answer follow Kyle's instructions.
- FAQ answers are always visible, grouped by topic with jump links. Founder story includes Tech Mentor Technologies (1998), over 1,000 customers across 35 states, sale, five years off and a return to his passion. Credential wording refers to credentials held within staff; titles/statuses unchanged.
- Header uses a small linked asterisk after “24/7 emergency support,” with an explanatory footer note. Footer reads “Dependable IT. Practical AI.” on one line.
- Visible preview notices removed. Every page remains noindex; robots permits reading those directives. No optional tracking added.
- Genuine Formspree callback/contact forms route to the verified sales@techsavvy.consulting address. Formshield retained, honeypot added, no sensitive uploads. Success/error feedback, validation, double-submit protection and native no-JavaScript POST fallback included.
- Privacy/accessibility information now describes the actual GitHub/Formspree implementation rather than Wix's old provider wording. Revisit hosting disclosures during Cloudflare promotion.

## Verification before posting

- Both static builds pass: 21 pages, 797 internal asset/link references, two real form configurations, nine safe new-tab Further reading links.
- Local HTTP checks pass for 20 content pages, redirects/query strings, noindex, real 404, active navigation and video byte-range playback.
- Form endpoint/response tests reject unexpected endpoints and success/error payloads without sending network requests.
- Desktop and 390/320-pixel mobile layouts reviewed. No horizontal overflow in representative homepage, AI, Support, FAQ, About, Contact, Backup and Co-managed pages. FAQ cards and complete Chris quote inspected visually.
- Contact-form empty-field validation checked. One clearly labeled synthetic contact inquiry was accepted in-browser and its notification was found in Microsoft 365. Public callback-form delivery is checked after deployment; final verification evidence is kept outside the public repository.

## Operations and rollback

- Formspree Free limit is shared across this account's existing forms: 50 submissions/month. No paid upgrade, unrelated form change, enrollment-key publication or production-hosting change.
- Last deployed revision before this release: `472c535d681d8b6355b4c5e011cc9266fda4a149`. Revert the release commit to restore the earlier test-site artifact; do not reset unrelated work.
- Future Cloudflare promotion must use an explicitly approved commit and a separate approval for main-domain cutover. See CLOUDFLARE-RELEASE.md.
