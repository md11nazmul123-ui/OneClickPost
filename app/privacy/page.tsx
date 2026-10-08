import type { Metadata } from 'next';
import { LegalPage, Section, List, ExtLink } from '../../components/legal/LegalPage';
import { LEGAL } from '../../lib/legal';

export const metadata: Metadata = {
  title: 'Privacy Policy — OneClickPost',
  description: 'How OneClickPost collects, uses, stores and deletes your data.',
};

export default function PrivacyPage() {
  const email = LEGAL.contactEmail;

  return (
    <LegalPage title="Privacy Policy">
      <p>
        {LEGAL.appName} (“we”, “our”, “the app”) helps creators upload a video once and publish it to their own
        social media accounts. This policy explains what information we collect, why we collect it, how we protect
        it, and how you can delete it. By using {LEGAL.appName} you agree to this policy.
      </p>

      <Section title="1. Information we collect">
        <List
          items={[
            <><b>Account information:</b> your name, email address and password. Passwords are stored only as a secure one-way hash — we can never see them.</>,
            <><b>Connected social accounts:</b> when you connect a YouTube channel (and later Facebook, Instagram or TikTok), we receive the account ID, name, profile picture, basic public statistics (such as subscriber and video counts) and access tokens that let us publish on your behalf.</>,
            <><b>Videos and post content:</b> the videos you upload, and the titles, captions, hashtags and schedule times you write.</>,
            <><b>Video statistics:</b> view, like and comment counts for videos you published with {LEGAL.appName}, read from the platform so we can show them to you.</>,
            <><b>Technical data:</b> IP address, browser type and security logs (for example sign-in attempts), used only to keep the service secure and prevent abuse.</>,
          ]}
        />
        <p>We do not collect payment card details, contacts, location or any data from your device beyond what is listed above.</p>
      </Section>

      <Section title="2. How we use your information">
        <List
          items={[
            'To create and secure your account and sign you in.',
            'To upload and publish your videos to the accounts you choose, at the time you choose.',
            'To show you the status and statistics of your posts.',
            'To generate caption, title and hashtag suggestions when you ask for them.',
            'To send essential emails (email verification, password reset).',
            'To detect and prevent abuse, fraud and security problems.',
          ]}
        />
        <p>
          We do <b>not</b> sell your data, we do not use it for advertising, and we never post anything to your
          accounts without your action.
        </p>
      </Section>

      <Section title="3. YouTube and Google user data">
        <p>
          {LEGAL.appName} uses <b>YouTube API Services</b>. When you connect a YouTube channel we request only these
          permissions:
        </p>
        <List
          items={[
            <><code>youtube.upload</code> — to upload the videos you choose to publish.</>,
            <><code>youtube.readonly</code> — to read your channel name, picture and the statistics of videos you published with the app.</>,
          ]}
        />
        <p>
          By connecting YouTube you also agree to the{' '}
          <ExtLink href="https://www.youtube.com/t/terms">YouTube Terms of Service</ExtLink> and the{' '}
          <ExtLink href="https://policies.google.com/privacy">Google Privacy Policy</ExtLink>.
        </p>
        <p>
          {LEGAL.appName}’s use and transfer of information received from Google APIs to any other app will adhere to the{' '}
          <ExtLink href="https://developers.google.com/terms/api-services-user-data-policy">
            Google API Services User Data Policy
          </ExtLink>
          , including the Limited Use requirements. Google user data is used only to provide the features you see in
          the app, is never used for advertising, is never sold, and is never used to train AI models.
        </p>
        <p>
          You can remove {LEGAL.appName}’s access at any time by disconnecting the channel in the app, or from your
          Google account at{' '}
          <ExtLink href="https://myaccount.google.com/permissions">Google security settings</ExtLink>.
        </p>
      </Section>

      <Section title="4. AI suggestions">
        <p>
          When you press an AI button (title, caption or hashtags), the title and caption you typed are sent to an AI
          service — Google Gemini, or Groq as a backup — to write a suggestion. We do not send your video, your email
          or your account tokens. We do not store the text you send; we only keep a count of how many suggestions
          you used, to enforce fair daily limits.
        </p>
      </Section>

      <Section title="5. How long we keep your data">
        <List
          items={[
            'Video files are deleted from our servers automatically: 24 hours after they are published everywhere, 3 days if publishing failed somewhere (so you can retry), and 24 hours if they were never used in a post. Scheduled videos are kept until they are published.',
            'Post details (title, caption, status, links) and statistics are kept while your account is active, so you can see your history.',
            'Access tokens are deleted as soon as you disconnect an account.',
            'Security logs are kept only as long as needed to protect the service.',
            'When you delete your account, all of the above is deleted within 30 days.',
          ]}
        />
        <p>Deleting a video from our servers does not delete it from YouTube or any other platform — you control those copies.</p>
      </Section>

      <Section title="6. How we protect your data">
        <List
          items={[
            'All connections use HTTPS encryption.',
            'Access and refresh tokens are encrypted (AES-256) in our database and are never sent to your browser.',
            'Your session is kept in a secure, HttpOnly cookie.',
            'Sign-in, uploads and AI use are rate-limited to block attacks.',
          ]}
        />
        <p>No method of storage or transmission is 100% secure, but we work hard to protect your information.</p>
      </Section>

      <Section title="7. Sharing with others">
        <p>We share data only with the services needed to run the app:</p>
        <List
          items={[
            'Social platforms you connect (YouTube, and later Facebook, Instagram, TikTok) — to publish your posts.',
            'Hosting, database and file-storage providers that store our data securely.',
            'AI providers (Google Gemini, Groq) — only the text described in section 4.',
            'Email delivery providers — to send account emails.',
            'Authorities, if required by law.',
          ]}
        />
      </Section>

      <Section title="8. Your choices and rights">
        <List
          items={[
            'Disconnect any social account at any time from the Accounts page.',
            'Edit your name and profile in the app.',
            <>Ask for a copy of your data, a correction, or deletion of your account by emailing <a className="text-blue-700" href={`mailto:${email}`}>{email}</a>. See our <a className="text-blue-700" href="/data-deletion">Data Deletion</a> page.</>,
          ]}
        />
      </Section>

      <Section title="9. Cookies and local storage">
        <p>
          We use one essential cookie to keep you signed in, and your browser’s local storage to remember settings
          such as language and theme. We do not use advertising or tracking cookies.
        </p>
      </Section>

      <Section title="10. Children">
        <p>
          {LEGAL.appName} is not intended for children under 13, and we do not knowingly collect their data. If you
          believe a child has given us data, contact us and we will delete it.
        </p>
      </Section>

      <Section title="11. Changes to this policy">
        <p>
          If we change this policy we will update the effective date above, and for important changes we will notify
          you in the app or by email.
        </p>
      </Section>

      <Section title="12. Contact">
        <p>
          Questions or requests: <a className="text-blue-700" href={`mailto:${email}`}>{email}</a> ({LEGAL.country}).
        </p>
      </Section>
    </LegalPage>
  );
}
