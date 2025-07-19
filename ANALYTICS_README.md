# Job Analytics System

A comprehensive analytics system for tracking job engagement, application funnel, and user interactions. This system provides both backend data collection and frontend tracking with deduplication, session management, and reliable event delivery.

## 🏗️ Architecture Overview

### Data Model

- **job_analytics**: Raw event data (views, clicks, applications)
- **job_analytics_summary**: Daily aggregated statistics per job
- **job_analytics_metadata**: Overall system metrics and peak tracking

### Backend Components

- **Migration**: `1752668304779-CreateJobAnalyticsTables.ts`
- **Entities**: Job analytics data models with TypeORM
- **Services**: Event processing, deduplication, and aggregation
- **Controllers**: API endpoints for event ingestion and reporting
- **DTOs**: Request/response validation and typing

### Frontend Components

- **Analytics Service**: Singleton service with batching and deduplication
- **React Hooks**: Easy-to-use hooks for component integration
- **Type Definitions**: Complete TypeScript interfaces
- **Examples**: Real-world integration patterns

## 🚀 Quick Start

### 1. Backend Setup

The backend is already configured with entities, services, and migration. Complete the setup:

```typescript
// In your analytics.module.ts (already created)
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [AnalyticsModule],
  // ...
})
export class AppModule {}
```

### 2. Frontend Integration

#### Basic Job View Tracking

```typescript
import { useAutoJobViewTracking } from '../hooks/use-job-analytics';

const JobDetailPage = ({ job }) => {
  // Automatically tracks when component mounts
  useAutoJobViewTracking(job?.id, job?.company?.id, {
    source: 'job_detail_page',
    quickApply: false,
  });

  return <div>{/* job content */}</div>;
};
```

#### Manual Event Tracking

```typescript
import { useJobAnalytics } from '../hooks/use-job-analytics';

const JobCard = ({ job }) => {
  const { trackJobClick, trackApplicationStart } = useJobAnalytics();

  const handleApplyClick = () => {
    trackJobClick(job.id, job.company.id, 'apply_button');
    trackApplicationStart(job.id, job.company.id, {
      applicationType: 'quick_apply',
    });
  };

  return <button onClick={handleApplyClick}>Apply Now</button>;
};
```

#### Automatic Click Tracking Hook

```typescript
import { useJobClickTracking } from '../hooks/use-job-analytics';

const JobTitle = ({ job }) => {
  const handleClick = useJobClickTracking(job.id, job.company.id, 'job_title_click', {
    source: 'search_results',
  });

  return <h3 onClick={handleClick}>{job.title}</h3>;
};
```

## 📊 Event Types & Tracking

### Event Types

- **view**: Job page views
- **click**: Any clickable interaction (apply buttons, company links, etc.)
- **application**: Application start events

### Click Types

- `apply_button`: Main apply button clicks
- `quick_apply`: Quick apply button clicks
- `company_profile`: Company name/profile clicks
- `job_title_click`: Job title clicks in listings
- `save_job`: Save job button clicks
- `share_job`: Share job button clicks
- `external_apply`: External application redirects

### Common Metadata Fields

```typescript
{
  source: 'job_detail_page' | 'search_results' | 'related_jobs',
  buttonType: 'apply_now' | 'quick_apply' | 'company_profile',
  applicationType: 'quick_apply' | 'full_application',
  listPosition: 1, // Position in search results
  referrer: 'https://example.com',
  userAgent: 'Mozilla/5.0...',
  campaignId: 'summer_2024',
  experiment: 'new_apply_flow'
}
```

## 🔧 Features

### Deduplication

- **View Deduplication**: 5-minute window per job/user
- **Click Deduplication**: 30-second window per event type
- **Session Management**: Persistent session IDs across browser sessions
- **Component-level**: Additional deduplication in React hooks

### Reliability

- **Batch Processing**: Events batched and sent periodically
- **Retry Logic**: Automatic retry with exponential backoff
- **Fallback Storage**: localStorage/sessionStorage for offline events
- **sendBeacon**: Reliable event delivery on page unload
- **Error Handling**: Non-blocking analytics (app continues on failure)

### Performance

- **Lightweight**: Minimal impact on user experience
- **Efficient**: Batched requests reduce server load
- **Smart Queueing**: Intelligent event queuing and flushing
- **Memory Management**: Automatic cleanup of old data

## 🛠️ Integration Checklist

### Frontend Integration Status

- ✅ Job Detail Pages (`useAutoJobViewTracking`)
- ✅ Apply Buttons (`trackJobClick` + `trackApplicationStart`)
- ✅ Company Profile Links (`trackJobClick`)
- ⏳ Job Listings (add to search results)
- ⏳ Related Jobs (add to related job clicks)
- ⏳ Save Job (add to save actions)
- ⏳ Share Job (add to share actions)
- ⏳ External Apply (track external redirects)

### Backend Integration Status

- ✅ Database Schema (migration created)
- ✅ Entities (all models defined)
- ✅ Services (event processing logic)
- ⏳ Controllers (complete API endpoints)
- ⏳ Module Registration (wire everything together)
- ⏳ Aggregation Jobs (daily/hourly summaries)

## 📝 API Endpoints

### Track Events

```http
POST /analytics/events
Content-Type: application/json

{
  "events": [
    {
      "jobId": 123,
      "companyId": 456,
      "eventType": "view",
      "metadata": {
        "source": "job_detail_page"
      }
    }
  ]
}
```

### Get Analytics

```http
GET /analytics/summary?jobId=123&startDate=2024-01-01&endDate=2024-01-31
```

## 🧪 Testing

### Test Analytics Locally

```typescript
import { jobAnalytics } from '../services/job-analytics.service';

// Enable debug mode
jobAnalytics.setDebugMode(true);

// Track test events
await jobAnalytics.trackJobView(123, 456, { source: 'test' });
await jobAnalytics.trackJobClick(123, 456, 'test_click');

// Check session info
console.log(jobAnalytics.getSessionInfo());

// Force flush events
await jobAnalytics.flush();
```

### Verify Event Storage

```sql
-- Check raw events
SELECT * FROM job_analytics WHERE job_id = 123 ORDER BY created_at DESC;

-- Check daily summaries
SELECT * FROM job_analytics_summary WHERE job_id = 123;

-- Check system metadata
SELECT * FROM job_analytics_metadata;
```

## 📈 Analytics Dashboard Ideas

### Key Metrics to Track

1. **Funnel Conversion**:

   - View → Click → Application rates
   - Drop-off points in application flow
   - Time to apply after view

2. **Job Performance**:

   - Most viewed jobs
   - Highest converting jobs
   - Job engagement over time

3. **Company Insights**:

   - Company profile click rates
   - Company job performance
   - Employer brand engagement

4. **User Behavior**:

   - Session duration and engagement
   - Device/browser preferences
   - Traffic source effectiveness

5. **Campaign ROI**:
   - UTM parameter performance
   - Marketing channel effectiveness
   - A/B test results

## 🔒 Privacy & Compliance

### Data Collection

- No personally identifiable information stored
- Session-based tracking only
- User can clear session data anytime
- GDPR/CCPA compliant design

### Data Retention

- Raw events: 90 days (configurable)
- Aggregated data: 2 years
- Session data: Browser session only
- Automatic cleanup via scheduled jobs

## 🚨 Troubleshooting

### Common Issues

#### Events Not Appearing

1. Check network tab for failed requests
2. Verify job/company IDs are valid numbers
3. Check `jobAnalytics.getSessionInfo()` for session state
4. Enable debug mode: `jobAnalytics.setDebugMode(true)`

#### Duplicate Events

1. Verify deduplication is working: check session storage
2. Ensure hooks aren't called multiple times
3. Check component mount/unmount cycles

#### Performance Issues

1. Adjust batch size: `batchSize` in service config
2. Increase flush interval: `flushInterval` in service config
3. Check for memory leaks in event queue

### Debug Commands

```typescript
// Get current session
jobAnalytics.getSessionInfo();

// Check pending events
localStorage.getItem('driverfly_analytics_events');

// Force flush
await jobAnalytics.flush();

// Clear all data
jobAnalytics.clearSession();
```

## 🔄 Future Enhancements

### Phase 2 Features

- Real-time analytics dashboard
- Advanced funnel analysis
- Cohort tracking
- Heat map integration
- A/B testing framework
- Predictive analytics
- Mobile app tracking
- Email click tracking
- Social media integration
- Advanced segmentation

### Performance Optimizations

- Server-side event aggregation
- Redis caching for hot data
- CDN for analytics assets
- WebWorker for client processing
- GraphQL subscription for real-time data

---

## 📞 Support

For implementation questions or issues:

1. Check the examples in `examples/analytics-integration-examples.tsx`
2. Review the TypeScript interfaces in `services/analytics.types.ts`
3. Test with debug mode enabled
4. Check browser console for errors or warnings

The analytics system is designed to be non-intrusive and fault-tolerant. Analytics failures should never impact the user experience.
