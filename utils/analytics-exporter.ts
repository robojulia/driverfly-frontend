import { JobConversionMetrics, ConversionTimelineData } from '../pages/api/job-analytics';

export interface ExportOptions {
  format: 'csv' | 'json';
  includeTimeline: boolean;
  dateRange: string;
}

export class AnalyticsExporter {
  /**
   * Export analytics data to CSV format
   */
  static exportToCSV(
    metrics: JobConversionMetrics,
    timeline: ConversionTimelineData[],
    options: ExportOptions
  ): void {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `job-analytics-${metrics.jobId}-${timestamp}.csv`;

    let csvContent = 'data:text/csv;charset=utf-8,';

    // Add summary metrics
    csvContent += 'Metric,Value\n';
    csvContent += `Job ID,${metrics.jobId}\n`;
    csvContent += `Job Title,"${metrics.jobTitle}"\n`;
    csvContent += `Views,${metrics.views}\n`;
    csvContent += `Apply Clicks,${metrics.clickToApply}\n`;
    csvContent += `Company Clicks,${metrics.clickToCompany}\n`;
    csvContent += `Total Clicks,${metrics.totalClicks}\n`;
    csvContent += `Applications Started,${metrics.applicationsStarted}\n`;
    csvContent += `Short Form Applications,${metrics.shortFormApplications}\n`;
    csvContent += `Full Applications,${metrics.fullApplications}\n`;
    csvContent += `Total Applications,${metrics.totalApplications}\n`;
    csvContent += `View to Click Rate,${metrics.viewToClickRate}%\n`;
    csvContent += `Click to Application Rate,${metrics.clickToApplicationRate}%\n`;
    csvContent += `Overall Conversion Rate,${metrics.overallConversionRate}%\n`;
    csvContent += `Date Range,${options.dateRange}\n`;
    csvContent += `Export Date,${new Date().toISOString()}\n`;

    if (options.includeTimeline && timeline.length > 0) {
      csvContent += '\n\nTimeline Data\n';
      csvContent += 'Date,Views,Apply Clicks,Company Clicks,Total Applications,Conversion Rate\n';

      timeline.forEach((item) => {
        csvContent += `${item.date},${item.views},${item.clickToApply},${item.clickToCompany},${item.totalApplications},${item.overallConversionRate}%\n`;
      });
    }

    // Download the file
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Export analytics data to JSON format
   */
  static exportToJSON(
    metrics: JobConversionMetrics,
    timeline: ConversionTimelineData[],
    options: ExportOptions
  ): void {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `job-analytics-${metrics.jobId}-${timestamp}.json`;

    const exportData = {
      exportInfo: {
        exportDate: new Date().toISOString(),
        dateRange: options.dateRange,
        jobId: metrics.jobId,
        jobTitle: metrics.jobTitle,
      },
      metrics: metrics,
      timeline: options.includeTimeline ? timeline : undefined,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Copy analytics summary to clipboard for easy sharing
   */
  static async copyToClipboard(metrics: JobConversionMetrics): Promise<boolean> {
    const summary = `Job Analytics Summary - ${metrics.jobTitle}

📊 Views: ${metrics.views.toLocaleString()}
👆 Apply Clicks: ${metrics.clickToApply.toLocaleString()} (${metrics.viewToApplyClickRate.toFixed(
      1
    )}%)
📝 Applications: ${metrics.totalApplications.toLocaleString()} (${metrics.overallConversionRate.toFixed(
      1
    )}%)

Conversion Rates:
• View → Click: ${metrics.viewToClickRate.toFixed(1)}%
• Click → Apply: ${metrics.clickToApplicationRate.toFixed(1)}%
• Overall: ${metrics.overallConversionRate.toFixed(1)}%

Generated: ${new Date().toLocaleDateString()}`;

    try {
      await navigator.clipboard.writeText(summary);
      return true;
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      return false;
    }
  }
}
