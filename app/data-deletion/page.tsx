import type { Metadata } from 'next';
import { LegalPage, Section, List, ExtLink } from '../../components/legal/LegalPage';
import { LEGAL } from '../../lib/legal';

export const metadata: Metadata = {
  title: 'Data Deletion — OneClickPost',
  description: 'How to delete your OneClickPost data and remove app access.',
};

export default function DataDeletionPage() {
  const email = LEGAL.contactEmail;
  const subject = encodeURIComponent('Delete my OneClickPost account');

  return (
    <LegalPage title="Data Deletion Instructions">
      <p>You can remove {LEGAL.appName}’s access and delete your data at any time.</p>

      <Section title="1. Disconnect a social account (instant)">
        <List
          items={[
            'Open OneClickPost and go to Accounts.',
            'Choose the account (YouTube, Facebook, Instagram or TikTok) and tap Disconnect.',
            'We immediately delete the access tokens for that account and ask the platform to cancel our access.',
          ]}
        />
        <p>
          You can also remove access from the platform itself, for example in your{' '}
          <ExtLink href="https://myaccount.google.com/permissions">Google account permissions</ExtLink> or{' '}
          <ExtLink href="https://www.facebook.com/settings?tab=business_tools">Facebook Business Integrations</ExtLink>.
        </p>
      </Section>

      <Section title="2. Delete your whole account and all data">
        <p>
          Send an email to{' '}
          <a className="text-blue-700" href={`mailto:${email}?subject=${subject}`}>{email}</a> from the email address
          you use for {LEGAL.appName}, with the subject “Delete my OneClickPost account”.
        </p>
        <p>Within 30 days we will permanently delete:</p>
        <List
          items={[
            'Your profile (name, email, password hash).',
            'All connected social accounts and their tokens.',
            'All uploaded video files still on our servers.',
            'All posts, schedules, statistics and AI usage records.',
          ]}
        />
        <p>We will reply by email when the deletion is complete.</p>
      </Section>

      <Section title="3. What is not deleted">
        <p>
          Videos you already published stay on YouTube, Facebook, Instagram or TikTok — they belong to your accounts
          there and you can delete them on those platforms.
        </p>
      </Section>
    </LegalPage>
  );
}
