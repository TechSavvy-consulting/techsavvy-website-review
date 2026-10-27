# Backup and Proactive IT build — October 27, 2026

Review destination: https://websitenew.techsavvy.consulting/

Baseline: `4842b92` — the earlier homepage testimonial timing, monthly/weekly Proactive cadence, Blog note removal and AI wording updates are already included. This build does not redo those changes.

## Proactive IT — `/proactive-it`

One change only: the service-card heading **Monitoring and follow-through** becomes **Daily monitoring and follow-through**. Its paragraph is unchanged.

## Backup & Recovery — `/offsite-backup-recovery`

All replacement wording below comes from Kyle's screenshots and typed introduction. Existing layout, colors, icons not specifically identified, FAQ interaction, page metadata and links remain unchanged.

### 1. Top headline and introduction

**When something goes wrong, your business keeps going.**

Hardware fails. Files get deleted. Ransomware happens. We protect the data your business depends on, monitor your backups and test restores, so recovery is a plan, not a scramble.

### 2. Two icons in the top-right graphic

Replace the main graphic icon and the icon beside **Backup health** with a recognizable backup-drive symbol with a downward save arrow. Keep their existing sizes, colors, containers and labels. Other pages' icons are not changed.

### 3. Three benefits below the hero

- Local and offsite copies of your data
- Backups monitored by our team
- A recovery plan built around your business

### 4. Introduction above the six cards

Keep **Backup protection and recovery** and **Protect your data. Plan your recovery.** Replace only the following paragraph:

Backup protection is part of your managed IT relationship. We design it, run it and check it, so your data is there when you need it.

### 5. Six cards — in display order

**We start with what matters most**

We work with you to identify your critical systems and data, then set backup schedules, retention and responsibilities around them.

**Local and offsite copies**

Local backups make everyday restores quick. Offsite copies protect you from hardware failure, ransomware, fire and theft.

**Monitored by our team**

We review backup results, investigate warnings and failures, and resolve problems before they put your data at risk.

**Tested restores**

We test restores and recovery steps, document the results and fix any gaps before you ever need them.

**A recovery plan for your business**

Together we decide which systems come back first, so your people can get back to work with as little downtime as possible.

**Security and retention**

Encryption, access controls, separated storage and retention settings that fit your data and your compliance needs, including HIPAA where it applies.

### 6. Three questions and answers

Keep the FAQ introduction and existing expandable behavior. Replace the answers; the third question changes from **already use** to **already have**.

**Is cloud sync the same as a backup?**

No. Services like OneDrive, Google Drive and Dropbox sync changes to every device, including accidental deletions and files encrypted by ransomware. A true backup keeps separate, recoverable versions over time, with retention, access controls and tested restores.

**How quickly could we recover?**

It depends on what fails. A deleted file can usually be restored quickly; rebuilding a failed server takes longer. During planning we agree on which systems matter most and test recovery against those priorities, so you know what to expect before anything goes wrong.

**Can you review the backups we already have?**

Yes. We’ll look at what’s covered, recent backup results, retention and whether restores have actually been tested, then give you a clear, practical recommendation.

### 7. Bottom blue call-to-action

Keep the eyebrow **A conversation is a good place to start**.

**How confident are you in your backups?**

If you’re not sure your data could be restored today, let’s find out together.

Button: **Talk with us about your backups →**

Destination remains `/contact`. The other pages retain their existing call-to-action wording.

## Scope and recoverability

- Only these two pages have intended visible changes; no styling or page-order changes.
- Live Wix, main website DNS, email, advertising, tracking, forms, indexing and Cloudflare deployment are outside this build.
- Review-site noindex and production canonical settings remain unchanged.
- Git retains the baseline and this build. Roll back this build with a targeted revert if requested; do not reset or overwrite unrelated work.
- Verification results are reported with the delivered preview. No inquiry forms are submitted during this build.

## Pre-publication verification

- Standard and GitHub Pages builds passed: 24 pages, 847 local links/assets and three configured forms checked.
- Form regression tests passed without network submissions; existing six-second testimonial behavior passed.
- Local HTTP checks passed for 23 served routes, redirects, noindex, custom 404, video requests and rejected writes.
- All 22 unrelated HTML pages are byte-for-byte unchanged from the preceding built output. Only Backup and Proactive IT changed.
- Desktop visual check at 1440px and phone visual check at 390px passed. Width checks at 390px and 320px found no horizontal overflow.
- All three Backup FAQs expanded to the approved text; the new bottom button navigated to Contact successfully.
- Independent read-only review confirmed exact screenshot wording, unchanged shared defaults and icon scope. `git diff --check` passed.
