/**
 * Public Formspree integration settings, not an API key or secret.
 * Verified October 26, 2026: TechSavvy Website Inquiries, notifying the
 * preverified sales@techsavvy.consulting address. A blank endpoint shows
 * phone/email instead.
 *
 * Keep native mode when Formspree hosts the anti-spam challenge. AJAX mode is
 * available after verifying the form's spam-protection configuration supports
 * it. Do not disable spam protection simply to enable AJAX.
 *
 * https://help.formspree.io/articles/building-your-form/building-an-html-form
 * https://help.formspree.io/articles/form-and-project-settings/recaptcha-settings
 */
export const contactFormConfig: {
  endpoint: string;
  submissionMode: 'native' | 'ajax';
} = {
  endpoint: 'https://formspree.io/f/mvkkkwyn',
  // Verified form defaults: enabled, Formshield on, CAPTCHA disabled.
  // No spam-protection setting was disabled to enable this integration.
  submissionMode: 'ajax',
};

export function getContactFormEndpoint(): string | null {
  const endpoint = contactFormConfig.endpoint.trim();
  if (!endpoint) return null;

  // Fail the build rather than silently sending visitor information to a typo,
  // an unapproved service, a legacy email endpoint or a URL with extra data.
  const parsed = new URL(endpoint);
  if (
    parsed.protocol !== 'https:' ||
    parsed.hostname !== 'formspree.io' ||
    parsed.port || parsed.username || parsed.password || parsed.search || parsed.hash ||
    !/^\/f\/[a-z0-9]+$/i.test(parsed.pathname)
  ) {
    throw new Error('Contact form endpoint must be a verified https://formspree.io/f/<form-id> URL.');
  }

  return parsed.href;
}
