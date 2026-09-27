import { ANALYTICS_METRICS } from '../data/initialData';
import { PLATFORM_AUDIENCE_METRICS, PlatformAudienceData } from '../data/platformAudienceData';
import { PlatformId } from '../types';

/**
 * Escapes fields to be CSV-compliant (handles commas, quotes, newlines)
 */
function escapeCSV(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Initiates browser download of CSV string
 */
export function downloadCSV(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads CSV for a single specific platform's engagement and audience metrics
 */
export function exportSinglePlatformCSV(platform: PlatformId): void {
  const p = PLATFORM_AUDIENCE_METRICS[platform];
  const pGeneral = ANALYTICS_METRICS.platformBreakdown.find((item) => item.platform === platform);

  const lines: string[] = [];

  // Metadata
  lines.push(`Report Name,"OneClickPost Platform Performance & Audience Report"`);
  lines.push(`Platform,${escapeCSV(p?.platformName || platform)}`);
  lines.push(`Exported Date,${escapeCSV(new Date().toISOString().split('T')[0])}`);
  lines.push(`Generated Time,${escapeCSV(new Date().toLocaleTimeString())}`);
  lines.push('');

  // Primary Platform Summary Metrics
  lines.push('SECTION,Metric,Value,Unit/Context');
  lines.push(`Performance,Total Views,${escapeCSV(p?.totalViews || pGeneral?.views || '0')},Views`);
  lines.push(`Performance,Subscribers / Followers,${escapeCSV(p?.activeFollowers || 'N/A')},Accounts`);
  lines.push(`Performance,Growth Rate (MoM),${escapeCSV(p?.growth || pGeneral?.growth || '0%')},Growth`);
  lines.push(`Engagement,Total Likes,${escapeCSV(pGeneral?.likes || 'N/A')},Likes`);
  lines.push(`Engagement,Total Comments,${escapeCSV(pGeneral?.comments || 'N/A')},Comments`);
  lines.push(`Engagement,Total Shares,${escapeCSV(pGeneral?.shares || 'N/A')},Shares`);
  lines.push(`Viewer Retention,Average Watch Time,${escapeCSV(p?.avgWatchTime || 'N/A')},Duration`);
  lines.push(`Viewer Retention,Retention Rate,${escapeCSV(p?.retentionRate || 'N/A')},Percentage`);
  lines.push(`Audience Behavior,Peak Active Hours,${escapeCSV(p?.peakActiveHours || 'N/A')},Time Range`);
  lines.push('');

  // Age Breakdown
  if (p?.ageGroups && p.ageGroups.length > 0) {
    lines.push('AGE DEMOGRAPHICS,Age Range,Audience Share (%),Estimated Viewers');
    p.ageGroups.forEach((age) => {
      lines.push(`Age Group,${escapeCSV(age.range)},${age.percent}%,${escapeCSV(age.countLabel)}`);
    });
    lines.push('');
  }

  // Country / Geo Locations
  if (p?.topLocations && p.topLocations.length > 0) {
    lines.push('GEOGRAPHIC DEMOGRAPHICS,Rank,Country,Country Code,Audience Share (%),Active Viewers');
    p.topLocations.forEach((loc, idx) => {
      lines.push(`Country Location,#${idx + 1},${escapeCSV(loc.country)},${escapeCSV(loc.code)},${loc.percent}%,${escapeCSV(loc.viewers)}`);
    });
    lines.push('');
  }

  // Categories & Interests
  if (p?.audienceCategories && p.audienceCategories.length > 0) {
    lines.push('AUDIENCE INTERESTS,Rank,Category / Topic,Audience Affinity (%),Description');
    p.audienceCategories.forEach((cat, idx) => {
      lines.push(`Audience Category,#${idx + 1},${escapeCSV(cat.category)},${cat.percent}%,${escapeCSV(cat.description)}`);
    });
    lines.push('');
  }

  // Gender & Devices
  if (p?.gender && p.gender.length > 0) {
    lines.push('GENDER BREAKDOWN,Gender Type,Audience Share (%)');
    p.gender.forEach((g) => {
      lines.push(`Gender,${escapeCSV(g.type)},${g.percent}%`);
    });
    lines.push('');
  }

  if (p?.deviceBreakdown && p.deviceBreakdown.length > 0) {
    lines.push('DEVICE PLATFORMS,Device Type,Audience Share (%)');
    p.deviceBreakdown.forEach((d) => {
      lines.push(`Device,${escapeCSV(d.device)},${d.percent}%`);
    });
    lines.push('');
  }

  const csvString = lines.join('\n');
  const filename = `${platform}_analytics_export_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(filename, csvString);
}

/**
 * Generates and downloads CSV of all platforms view & engagement metrics comparison table
 */
export function exportAllPlatformsComparisonCSV(): void {
  const lines: string[] = [];

  lines.push(`Report Name,"OneClickPost Multi-Platform Performance & Engagement Comparison"`);
  lines.push(`Exported Date,${escapeCSV(new Date().toISOString().split('T')[0])}`);
  lines.push(`Total Aggregated Views,${escapeCSV(ANALYTICS_METRICS.totalViews)}`);
  lines.push(`Overall Engagement Rate,${escapeCSV(ANALYTICS_METRICS.engagementRate)}`);
  lines.push(`Total Follower Reach,${escapeCSV(ANALYTICS_METRICS.followersTotal)}`);
  lines.push('');

  // Comparison Table Header
  lines.push('Platform,Total Views,Likes,Comments,Shares,Growth Rate,Subscribers/Followers,Avg Watch Time,Retention Rate,Dominant Age Group,Top Country');

  ANALYTICS_METRICS.platformBreakdown.forEach((item) => {
    const pAud = PLATFORM_AUDIENCE_METRICS[item.platform as PlatformId];
    const topAge = pAud?.ageGroups?.reduce((a, b) => (a.percent > b.percent ? a : b), pAud.ageGroups[0])?.range || 'N/A';
    const topCountry = pAud?.topLocations?.[0]?.country || 'N/A';

    lines.push([
      escapeCSV(item.platform.toUpperCase()),
      escapeCSV(item.views),
      escapeCSV(item.likes),
      escapeCSV(item.comments),
      escapeCSV(item.shares),
      escapeCSV(item.growth),
      escapeCSV(pAud?.activeFollowers || 'N/A'),
      escapeCSV(pAud?.avgWatchTime || 'N/A'),
      escapeCSV(pAud?.retentionRate || 'N/A'),
      escapeCSV(topAge),
      escapeCSV(topCountry),
    ].join(','));
  });

  lines.push('');
  lines.push('DAILY VIEWS TIMELINE (LAST 30 DAYS)');
  lines.push('Day,Aggregated Daily Views');
  ANALYTICS_METRICS.monthlyViewsData.forEach((d) => {
    lines.push(`Day ${d.day},${d.views}`);
  });

  const csvString = lines.join('\n');
  const filename = `all_platforms_engagement_summary_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(filename, csvString);
}

/**
 * Exports complete aggregated analytics (Overview, Daily Timeline, Demographics, and Cross-Platform)
 */
export function exportComprehensiveAnalyticsCSV(): void {
  const m = ANALYTICS_METRICS;
  const lines: string[] = [];

  lines.push(`Report Name,"OneClickPost Comprehensive Analytics & Audience Intelligence"`);
  lines.push(`Exported Date,${escapeCSV(new Date().toISOString().split('T')[0])}`);
  lines.push(`Generated Time,${escapeCSV(new Date().toLocaleTimeString())}`);
  lines.push('');

  // Executive KPI summary
  lines.push('OVERVIEW KPIs,Metric,Value');
  lines.push(`Executive Summary,Total Views,${escapeCSV(m.totalViews)}`);
  lines.push(`Executive Summary,Total Engagements,${escapeCSV(m.totalEngagements)}`);
  lines.push(`Executive Summary,Average Engagement Rate,${escapeCSV(m.engagementRate)}`);
  lines.push(`Executive Summary,Total Audience Reach,${escapeCSV(m.followersTotal)}`);
  lines.push(`Executive Summary,Monthly Growth Rate,${escapeCSV(m.growthPercent)}`);
  lines.push(`Executive Summary,Published Posts Count,${escapeCSV(m.publishedPostsCount)}`);
  lines.push('');

  // Daily Trend
  lines.push('30-DAY VIEWS TRAJECTORY,Day of Month,Views Count');
  m.monthlyViewsData.forEach((d) => {
    lines.push(`Daily Metric,Day ${d.day},${d.views}`);
  });
  lines.push('');

  // Platform Breakdown Table
  lines.push('CROSS-PLATFORM ENGAGEMENT,Platform,Views,Likes,Comments,Shares,Growth Rate');
  m.platformBreakdown.forEach((p) => {
    lines.push(`Platform Row,${escapeCSV(p.platform.toUpperCase())},${escapeCSV(p.views)},${escapeCSV(p.likes)},${escapeCSV(p.comments)},${escapeCSV(p.shares)},${escapeCSV(p.growth)}`);
  });
  lines.push('');

  // Overall Age Demographics
  lines.push('AGGREGATED AGE DEMOGRAPHICS,Age Range,Percentage Share (%)');
  m.audienceDemographics.ageGroups.forEach((age) => {
    lines.push(`Age Demographic,${escapeCSV(age.range)},${age.percent}%`);
  });
  lines.push('');

  // Overall Top Geographies
  lines.push('AGGREGATED GEOGRAPHIES,Country,Percentage Share (%)');
  m.audienceDemographics.topLocations.forEach((loc) => {
    lines.push(`Geo Location,${escapeCSV(loc.country)},${loc.percent}%`);
  });
  lines.push('');

  // Detailed platform-by-platform section
  const platforms: PlatformId[] = ['youtube', 'facebook', 'instagram', 'tiktok', 'x', 'linkedin', 'pinterest'];
  platforms.forEach((plat) => {
    const pAud = PLATFORM_AUDIENCE_METRICS[plat];
    if (!pAud) return;

    lines.push(`=======================================================`);
    lines.push(`DETAILED AUDIENCE BREAKDOWN: ${pAud.platformName.toUpperCase()}`);
    lines.push(`=======================================================`);
    lines.push(`Platform,${escapeCSV(pAud.platformName)}`);
    lines.push(`Total Platform Views,${escapeCSV(pAud.totalViews)}`);
    lines.push(`Followers/Subscribers,${escapeCSV(pAud.activeFollowers)}`);
    lines.push(`Growth Rate,${escapeCSV(pAud.growth)}`);
    lines.push(`Average Watch Time,${escapeCSV(pAud.avgWatchTime)}`);
    lines.push(`Retention Rate,${escapeCSV(pAud.retentionRate)}`);
    lines.push(`Peak Hours,${escapeCSV(pAud.peakActiveHours)}`);
    lines.push(`Audience Summary,${escapeCSV(pAud.primaryDemographicSummary)}`);
    lines.push('');

    // Age
    lines.push(`${plat.toUpperCase()} AGE GROUPS,Range,Share (%),Viewer Count`);
    pAud.ageGroups.forEach((a) => {
      lines.push(`${plat.toUpperCase()} Age,${escapeCSV(a.range)},${a.percent}%,${escapeCSV(a.countLabel)}`);
    });
    lines.push('');

    // Locations
    lines.push(`${plat.toUpperCase()} TOP LOCATIONS,Country,Code,Share (%),Active Viewers`);
    pAud.topLocations.forEach((l) => {
      lines.push(`${plat.toUpperCase()} Country,${escapeCSV(l.country)},${escapeCSV(l.code)},${l.percent}%,${escapeCSV(l.viewers)}`);
    });
    lines.push('');

    // Categories
    lines.push(`${plat.toUpperCase()} INTEREST CATEGORIES,Category Name,Affinity (%),Description`);
    pAud.audienceCategories.forEach((c) => {
      lines.push(`${plat.toUpperCase()} Category,${escapeCSV(c.category)},${c.percent}%,${escapeCSV(c.description)}`);
    });
    lines.push('');
  });

  const csvString = lines.join('\n');
  const filename = `comprehensive_analytics_export_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(filename, csvString);
}
