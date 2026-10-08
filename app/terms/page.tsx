import type { Metadata } from 'next';
import { LegalPage, Section, List, ExtLink } from '../../components/legal/LegalPage';
import { LEGAL } from '../../lib/legal';

export const metadata: Metadata = {
  title: 'Terms of Service — OneClickPost',
  description: 'The rules for using OneClickPost.',
};

export default function TermsPage() {
  const email = LEGAL.contactEmail;

  return (
    <LegalPage title="Terms of Service">
      <p>
        These terms are an agreement between you and {LEGAL.appName}. By creating an account or using the app you
        accept them. If you do not agree, please do not use {LEGAL.appName}.
      </p>

      <Section title="1. What the service does">
        <p>
          {LEGAL.appName} lets you upload a video once, write a title and caption (optionally with AI help), and
          publish or schedule it to social media accounts that you own or manage. Features may change as we improve
          the app.
        </p>
      </Section>

      <Section title="2. Your account">
        <List
          items={[
            'You must be at least 13 years old (or the minimum age in your country) to use the app.',
            'Give correct information and keep your password secret. You are responsible for activity on your account.',
            <>Tell us right away at <a className="text-blue-700" href={`mailto:${email}`}>{email}</a> if you think your account was used without permission.</>,
          ]}
        />
      </Section>

      <Section title="3. Your content">
        <List
          items={[
            'You keep all rights to the videos and text you upload. We claim no ownership.',
            'You give us a limited permission to store, process and send your content only so we can publish it where you tell us to.',
            'You confirm you have the rights to everything you upload, including music, images and people shown in it.',
          ]}
        />
      </Section>

      <Section title="4. Acceptable use">
        <p>You agree not to use {LEGAL.appName} to:</p>
        <List
          items={[
            'Upload anything illegal, hateful, violent, sexually explicit involving minors, or that infringes someone else’s rights.',
            'Send spam, mislead people, or impersonate someone else.',
            'Break the rules of any connected platform.',
            'Attack, overload, reverse-engineer or try to get around the security or limits of the app.',
          ]}
        />
        <p>We may remove content or suspend accounts that break these rules.</p>
      </Section>

      <Section title="5. Connected platforms">
        <p>
          When you publish to a platform, that platform’s own rules also apply to you. For YouTube these are the{' '}
          <ExtLink href="https://www.youtube.com/t/terms">YouTube Terms of Service</ExtLink>. Platforms may change
          their APIs, limit uploads, or keep videos private until they review an app — we cannot control this and are
          not responsible for decisions made by those platforms.
        </p>
      </Section>

      <Section title="6. AI suggestions">
        <p>
          AI-written titles, captions and hashtags are suggestions. They may be inaccurate or unsuitable. Please
          review them before publishing — you are responsible for what you post.
        </p>
      </Section>

      <Section title="7. Free service and limits">
        <p>
          {LEGAL.appName} is currently free. We may set fair-use limits (for example, daily AI uses, file sizes or
          uploads per hour) to keep the service working well for everyone. If we introduce paid plans, we will tell
          you clearly before you are charged anything.
        </p>
      </Section>

      <Section title="8. Availability and changes">
        <p>
          We try to keep the app running and your scheduled posts on time, but we cannot promise it will always be
          available or error-free. We may change or stop features, and we may update these terms — the effective date
          above will show the latest version.
        </p>
      </Section>

      <Section title="9. Limitation of liability">
        <p>
          The service is provided “as is”. To the extent allowed by law, {LEGAL.appName} is not liable for indirect
          losses, lost profits, lost views or followers, or content that fails to publish, is delayed, or is removed
          by a platform.
        </p>
      </Section>

      <Section title="10. Ending your use">
        <p>
          You can stop using the app at any time and ask us to delete your account (see{' '}
          <a className="text-blue-700" href="/data-deletion">Data Deletion</a>). We may suspend or close accounts that
          break these terms or the law.
        </p>
      </Section>

      <Section title="11. Governing law">
        <p>These terms are governed by the laws of {LEGAL.country}.</p>
      </Section>

      <Section title="12. Contact">
        <p>
          Questions about these terms: <a className="text-blue-700" href={`mailto:${email}`}>{email}</a>. See also our{' '}
          <a className="text-blue-700" href="/privacy">Privacy Policy</a>.
        </p>
      </Section>
    </LegalPage>
  );
}
