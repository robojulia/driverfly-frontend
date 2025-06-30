# Campaign System Frontend

This document describes the frontend implementation of the Driverfly campaign system.

## Overview

The campaign system frontend provides a marketing-style interface for managing automated outreach campaigns. It's built with Next.js/React and integrates with the backend campaign API.

## Features

### ✅ Implemented

- **Campaign Dashboard** (`/dashboard/company/campaigns`)
  - Marketing-style campaign cards with statistics
  - Feature flag gating (`CAMPAIGNS_ENABLED`)
  - Real-time campaign status and metrics
- **Campaign Detail View** (`/dashboard/company/campaigns/[id]`)

  - Comprehensive campaign overview
  - Target management and statistics
  - Campaign-specific configuration display
  - Campaign controls (cancel, restart)

- **Navigation Integration**

  - Added to Company section in sidebar
  - Feature flag controlled visibility

- **API Integration**
  - Complete campaigns API client
  - React hooks for data management
  - Error handling and loading states

### 🔄 Planned

- Campaign creation wizard
- Campaign editing interface
- Advanced filtering and search
- Bulk operations
- Campaign templates

## File Structure

```
driverfly-frontend/
├── pages/dashboard/company/campaigns/
│   ├── index.tsx                    # Main campaigns dashboard
│   └── [id].tsx                     # Campaign detail page
├── components/campaigns/
│   ├── campaign-card.tsx            # Reusable campaign card
│   ├── campaign-config-display.tsx  # Campaign configuration display
│   └── index.ts                     # Component exports
├── hooks/campaigns/
│   └── use-campaigns.ts             # Campaign data hooks
├── models/campaigns/
│   ├── campaign.entity.ts           # Campaign model
│   ├── campaign-target.entity.ts    # Campaign target model
│   ├── campaign-query.dto.ts        # Query parameters
│   └── update-campaign.dto.ts       # Update DTO
├── enums/campaigns/
│   ├── campaign-type.enum.ts        # Campaign types
│   ├── campaign-status.enum.ts      # Campaign statuses
│   └── campaign-target-type.enum.ts # Target types
├── pages/api/
│   └── campaigns.ts                 # Campaign API client
└── styles/
    └── campaigns.module.css         # Campaign-specific styles
```

## Usage

### Accessing the Campaign Dashboard

1. Ensure the `CAMPAIGNS_ENABLED` feature flag is set to `true`
2. Navigate to `/dashboard/company/campaigns`
3. The "Campaigns" menu item will appear in the Company section

### Campaign Dashboard Features

- **Campaign Cards**: Display campaign overview with key metrics
- **Status Indicators**: Visual status badges (Draft, Running, Completed, etc.)
- **Quick Actions**: View, Cancel, Restart campaigns
- **Statistics**: Success rates, target counts, delivery metrics

### Campaign Detail Page

- **Overview Tab**: Campaign details and success metrics
- **Targets Tab**: List of campaign targets with status
- **Settings Tab**: Campaign-specific configuration

## API Integration

### Campaign API Client (`pages/api/campaigns.ts`)

```typescript
import CampaignsApi from '../../../api/campaigns';

const api = new CampaignsApi();

// Get all campaigns
const campaigns = await api.findAll({
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'DESC',
});

// Get campaign details
const campaign = await api.findById(campaignId);

// Update campaign
const updated = await api.update(campaignId, { status: 'cancelled' });

// Cancel campaign
await api.cancel(campaignId);

// Regenerate targets
await api.regenerateTargets(campaignId);
```

### React Hooks (`hooks/campaigns/use-campaigns.ts`)

```typescript
import { useCampaigns, useCampaign } from '../hooks/campaigns/use-campaigns';

// For campaign list
const { campaigns, loading, error, loadCampaigns } = useCampaigns();

// For single campaign
const { campaign, targets, stats, loading } = useCampaign(campaignId);
```

## Feature Flag Integration

The campaign system is gated behind the `CAMPAIGNS_ENABLED` feature flag:

```typescript
import { useFeatureFlags } from '../context/feature-flag-context';

const { isFeatureEnabled } = useFeatureFlags();

if (!isFeatureEnabled('CAMPAIGNS_ENABLED')) {
  // Hide campaign features
  return null;
}
```

## Campaign Types

### Job Reachout Campaign

The primary campaign type for reaching out to potential drivers about specific job opportunities.

**Configuration Example:**

```json
{
  "jobId": 123,
  "includePhoneCalls": true,
  "includeSms": true,
  "maxAttempts": 3,
  "eligibilityCriteria": {
    "cdlRequired": true,
    "minExperience": 2,
    "maxViolations": 2
  },
  "schedule": {
    "startTime": "09:00",
    "endTime": "17:00",
    "timezone": "America/New_York"
  },
  "messageTemplate": {
    "sms": "Hi {{name}}, we have a great driving opportunity at {{company}}...",
    "phoneScript": "Hello, this is {{caller}} from {{company}}..."
  }
}
```

## Styling

Campaign components use CSS modules (`styles/campaigns.module.css`) for:

- Marketing-style campaign cards
- Hover effects and transitions
- Responsive design
- Status-based color coding
- Professional dashboard appearance

## Extensibility

The system is designed for easy extension:

### Adding New Campaign Types

1. Add new type to `enums/campaigns/campaign-type.enum.ts`
2. Update `getCampaignTypeLabel()` functions
3. Add type-specific configuration display in `CampaignConfigDisplay`
4. Create campaign creation wizard for the new type

### Adding New Features

1. Update API client with new endpoints
2. Add new hooks for data management
3. Create new components as needed
4. Update navigation and routing

### Custom Campaign Components

```typescript
import { CampaignCard, CampaignConfigDisplay } from '../components/campaigns';

// Use existing components
<CampaignCard
  campaign={campaign}
  onView={handleView}
  onAction={handleAction}
/>

// Extend for custom needs
<CustomCampaignCard
  campaign={campaign}
  customProp={value}
/>
```

## Translation Keys

All campaign-related text uses the translation system:

```json
{
  "CAMPAIGNS": "Campaigns",
  "MARKETING_CAMPAIGNS": "Marketing Campaigns",
  "JOB_REACHOUT_CAMPAIGN": "Job Outreach Campaign",
  "CAMPAIGN_DETAILS": "Campaign Details",
  "SUCCESS_RATE": "Success Rate"
  // ... more keys
}
```

## Error Handling

- API errors are handled in hooks and displayed in UI
- Loading states for better UX
- Graceful degradation when features are disabled
- User-friendly error messages

## Performance Considerations

- Campaign data is paginated
- React hooks prevent unnecessary re-renders
- CSS modules for optimized styling
- Lazy loading for large target lists

## Security

- Feature flag controlled access
- API authentication via base API class
- User permission checks (future enhancement)
- Secure campaign data handling

## Future Enhancements

1. **Campaign Creation Wizard**

   - Multi-step form for creating campaigns
   - Template selection
   - Target audience builder

2. **Advanced Analytics**

   - Campaign performance charts
   - Conversion tracking
   - ROI calculations

3. **Bulk Operations**

   - Multi-campaign actions
   - Batch updates
   - Export functionality

4. **Real-time Updates**

   - WebSocket integration
   - Live campaign status
   - Real-time metrics

5. **Campaign Templates**
   - Pre-built campaign types
   - Custom template creation
   - Template sharing
