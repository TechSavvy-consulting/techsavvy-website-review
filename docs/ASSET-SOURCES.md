# Public asset provenance

Source inventory retrieved October 24, 2026. These are existing public website assets, not private customer records.

| Local original | Source |
| --- | --- |
| `kyle-server-room-original.png` | https://static.wixstatic.com/media/96e054_4ab56662322c4f7a8cda159c49ba5ce9~mv2.png |
| `kyle-hearn-original.png` | https://static.wixstatic.com/media/96e054_179b95c6fd82416c8bb1d657a35ac45b~mv2.png |
| `techsavvy-logo-original.png` | Existing compact TechSavvy logo used by the approved October 24 landing-page draft; original header mark: https://static.wixstatic.com/media/6c3b8b_562453ea7a8b4816af24642fd8ed6253~mv2.png |
| `emerge-logo-original.png` | https://static.wixstatic.com/media/96e054_f6d5a6ccfd76487bab95a62d006c02b6~mv2.png |
| `blog-windows11-original.jpg` | https://static.wixstatic.com/media/ce3336a21d2d4c29997a2d998b256cd4.jpg |
| `blog-switching-original.png` | https://static.wixstatic.com/media/96e054_e8205c9c08424b84a9a10d8ec3dd24d5~mv2.png |
| `blog-provider-original.png` | https://static.wixstatic.com/media/96e054_2a11d009b465479c8f3b157304a297f5~mv2.png |
| `home-video-poster-original.jpg` | https://static.wixstatic.com/media/96e054_dc111dff40b5481383b1883412fc9ae0f000.jpg |
| `public/videos/techsavvy-introduction.mp4` | https://video.wixstatic.com/video/96e054_dc111dff40b5481383b1883412fc9ae0/720p/mp4/file.mp4 |

The hero and suit headshot match the currently published PNG originals by SHA-256. The server-room image is an existing AI-recreated brand illustration featuring Kyle; it is not represented as documentary evidence of an actual customer facility.

WebP derivatives are generated with `scripts/prepare-assets.mjs`. The logo's proportions and lettering are preserved. The initial build used the existing images without generation; revision-specific additions are documented below.

## Revision 3 — October 26, 2026

Taryn Schell/Emerge Medical, Robert Hoffman/Pinpoint Personnel and Dr. Terry Tatum/Tulsa Chiropractic Associates quotations were verified against the current public Wix homepage carousel. Their customer wording is retained without new star ratings or review dates. Chris Moles/DetX Global is a selected excerpt previously used in TechSavvy's published LinkedIn post: https://www.linkedin.com/feed/update/urn:li:share:7512923320745574401/ . The original review's spelling of "Tech Savvy" is retained. Kyle requested additional rotating testimonials and identified the DetX website as a logo source.

The following unmodified transparent PNGs were obtained from the businesses' official websites. They replace white-backed or framed presentation; proportions are preserved with CSS. The Tulsa Chiropractic mark is displayed in white through a CSS filter for contrast against the dark banner; the original file is unchanged.

| Public file | Official source |
| --- | --- |
| `client-emerge.png` | https://emergetulsa.com/wp-content/uploads/2020/07/Emerge-Medical-header-logo.png |
| `client-pinpoint.png` | https://www.pinpointpersonnel.com/wp-content/uploads/2016/02/logo.png |
| `client-tulsa-chiropractic.png` | https://tulsachiropracticassociates.com/wp-content/uploads/Logo-Horizontal-scaled.png |
| `client-detx.png` | https://detxglobal.com/wp-content/uploads/2025/06/DetX-Final-white-scaled.png |

`blog-email-security.svg` is an original code-authored TechSavvy illustration. It depicts an envelope and shield, without third-party brand marks, stock photography or a simulated software screenshot. The two refreshed articles retain their existing approved images. The original introduction video is unchanged.

## Revision 4 — October 26, 2026

Chris Moles's full original Google review was inspected in Google Maps on October 26, 2026, on the verified TechSavvy Consulting, LLC listing (website techsavvy.consulting and phone 918-400-2424). The public reviewer display name is Chris M; the review is signed Chris Moles, General Manager. The new short, verbatim excerpt highlights server/backup/device support and prompt resolution. An ellipsis marks omitted words; no rating, response-time guarantee or new business claim was added. The testimonial source now points to the Google Maps reviews rather than the earlier LinkedIn excerpt.

## Revision 5 — October 26, 2026

Kyle supplied a screenshot of Chris Moles's original Google review and requested its opening and final recommendation be retained, removing only the sentence beginning “On the rare occasion.” That requested excerpt is now used, with spelling preserved. The carousel allows longer reading time for longer testimonials.

AI-page illustrations and client-support device graphics are original HTML/CSS/SVG artwork, not screenshots of a delivered client system or third-party product endorsements. Existing portraits, business logos and videos are unchanged.

Level download links were checked against official documentation and vendor servers on October 26, 2026. All five generic URLs returned HTTP 200; no installer was executed and no enrollment key is public. References: https://docs.level.io/en/articles/9926330-windows-install ; https://docs.level.io/en/articles/9926339-macos-install ; https://docs.level.io/en/articles/9926362-linux-install .

## Revision 6 — October 26, 2026

Kyle explicitly authorized correcting the three instances of “Tech Savvy” to “TechSavvy” in Chris Moles's supplied review. The approved excerpt otherwise stays unchanged. Seven-second browsing replaces variable long delays; pause, manual arrows, hover/focus pauses, hidden-tab handling and reduced-motion support remain.

The built-in image-generation tool produced these project assets. Prompts are retained in [revision 6 image prompts](REVISION-6-IMAGE-PROMPTS.json). Original PNGs stay in assets/originals; compressed WebP derivatives are used on the site. Existing originals are preserved. New article illustrations show fictional professionals, not TechSavvy employees, customers, a customer office or documented results.

| Source PNG | Public derivative | Use |
| --- | --- | --- |
| `blog-ai-workflows-original.png` | `public/images/blog-ai-workflows.webp` | AI-workflows article cover and card; people at a laptop with illustrative workflow icons |
| `blog-it-growth-plan-original.png` | `public/images/blog-it-growth-plan.webp` | Growth-planning article cover and card; people discussing a tablet roadmap |
| `kyle-hearn-neutral-original.png` | `public/images/kyle-hearn-neutral.webp` | Plain neutral-gray background option retained for comparison |
| `kyle-hearn-slate-original.png` | `public/images/kyle-hearn-slate.webp` | About portrait: neutral gray with a faint slate-blue edge accent, selected after Kyle requested a little color |

Both portrait edits used the existing approved Kyle portrait as their edit target and instructed the tool to preserve identity, expression, clothing and framing while changing the background. They are AI-edited derivatives, not pixel-identical copies of the original subject. The original colored-background portrait remains available for rollback. New blog images are 1440×960; portrait derivatives are 1000×1000.

## Revision 7 — October 26, 2026

Kyle requested different people and a different setting for one of the two new article covers. The built-in image-generation tool created `assets/originals/blog-it-growth-plan-v2-original.png`; Sharp produced `public/images/blog-it-growth-plan-v2.webp` (1440×960, approximately 165 KB). The new growth-planning illustration shows a fictional owner and advisor standing in a brick-walled showroom. It does not depict actual TechSavvy employees, customers or documented client results. The AI-workflow image is unchanged. The prior growth illustration and all original files remain available for rollback.

The exact final prompt and saved paths are in [revision 7 image prompts](REVISION-7-IMAGE-PROMPTS.json). No CLI image-generation fallback was used.
