import React, { useState } from 'react';
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import {
  PlayFill,
  PauseFill,
  StopFill,
  ArrowRepeat,
  PlusCircle,
  EyeFill,
  ThreeDotsVertical,
  ArrowLeftShort,
  PersonPlusFill,
} from 'react-bootstrap-icons';
import { CampaignStatus } from '../../../enums/campaigns/campaign-status.enum';
import styles from './CampaignActions.module.css';

interface CampaignActionsProps {
  campaign: any;
  stats?: any;
  onStartCampaign: () => void;
  onPauseCampaign?: () => void;
  onResumeCampaign?: () => void;
  onCancelCampaign: () => void;
  onRefreshTargets: () => void;
  onAddManualTargets: () => void;
  onSendTest: () => void;
  onAddTestTarget: () => void;
  onViewJob?: () => void;
  onBackToCampaigns: () => void;
  loading?: boolean;
  canSendTest?: boolean;
  hasTestTarget?: boolean;
}

const CampaignActions: React.FC<CampaignActionsProps> = ({
  campaign,
  stats,
  onStartCampaign,
  onPauseCampaign,
  onResumeCampaign,
  onCancelCampaign,
  onRefreshTargets,
  onAddManualTargets,
  onSendTest,
  onAddTestTarget,
  onViewJob,
  onBackToCampaigns,
  loading = false,
  canSendTest = false,
  hasTestTarget = false,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const getPrimaryAction = () => {
    if (loading) {
      return {
        label: 'Loading...',
        action: () => {},
        color: 'secondary',
        icon: null,
        disabled: true,
      };
    }

    const hasTargets = (stats?.totalTargets || 0) > 0;

    switch (campaign?.status) {
      case CampaignStatus.DRAFT:
        if (!hasTargets) {
          return {
            label: 'Add Targets First',
            action: onRefreshTargets,
            color: 'warning',
            icon: <PlusCircle className="me-2" />,
            disabled: false,
            tooltip: 'Generate targets before launching campaign',
          };
        }
        return {
          label: 'Launch Campaign',
          action: onStartCampaign,
          color: 'success',
          icon: <PlayFill className="me-2" />,
          disabled: false,
          tooltip: `Ready to launch to ${stats?.totalTargets || 0} targets`,
        };

      case CampaignStatus.ACTIVE:
        return {
          label: 'Pause Campaign',
          action: onPauseCampaign || (() => {}),
          color: 'warning',
          icon: <PauseFill className="me-2" />,
          disabled: !onPauseCampaign,
        };

      case CampaignStatus.PAUSED:
        return {
          label: 'Resume Campaign',
          action: onResumeCampaign || (() => {}),
          color: 'success',
          icon: <PlayFill className="me-2" />,
          disabled: !onResumeCampaign,
        };

      case CampaignStatus.COMPLETED:
        return null; // No primary action for completed campaigns

      case CampaignStatus.CANCELLED:
        return null; // No primary action for cancelled campaigns

      case CampaignStatus.FAILED:
        return null; // No primary action for failed campaigns

      default:
        return {
          label: 'Launch Campaign',
          action: onStartCampaign,
          color: 'success',
          icon: <PlayFill className="me-2" />,
          disabled: !hasTargets,
        };
    }
  };

  const primaryAction = getPrimaryAction();

  const getSecondaryActions = () => {
    const actions = [];

    // View related job
    if (onViewJob) {
      actions.push({
        label: 'View Job Posting',
        action: onViewJob,
        icon: <EyeFill className="me-2" />,
      });
    }

    // Target management
    if (campaign?.status === CampaignStatus.DRAFT) {
      actions.push({
        label: 'Refresh Targets',
        action: onRefreshTargets,
        icon: <ArrowRepeat className="me-2" />,
      });

      actions.push({
        label: 'Add Manual Targets',
        action: onAddManualTargets,
        icon: <PersonPlusFill className="me-2" />,
      });
    }

    // Campaign management
    if (
      [CampaignStatus.DRAFT, CampaignStatus.ACTIVE, CampaignStatus.PAUSED].includes(
        campaign?.status
      )
    ) {
      actions.push({
        label: 'Cancel Campaign',
        action: onCancelCampaign,
        icon: <StopFill className="me-2" />,
        variant: 'danger',
      });
    }

    return actions;
  };

  const secondaryActions = getSecondaryActions();

  return (
    <div className={styles.campaignActions}>
      {/* Back Navigation */}
      <Button color="light" size="sm" onClick={onBackToCampaigns} className={styles.backButton}>
        <ArrowLeftShort /> Back to Campaigns
      </Button>

      {/* Primary Action */}
      <div className={styles.actionGroup}>
        {primaryAction && (
          <Button
            color={primaryAction.color}
            size="lg"
            onClick={primaryAction.action}
            disabled={primaryAction.disabled || loading}
            className={styles.primaryAction}
            title={primaryAction.tooltip}
          >
            {primaryAction.icon}
            {primaryAction.label}
          </Button>
        )}

        {/* Secondary Actions Dropdown */}
        {secondaryActions.length > 0 && (
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle color="light" size="lg" className={styles.dropdownToggle} caret={false}>
              <ThreeDotsVertical />
            </DropdownToggle>
            <DropdownMenu end className={styles.dropdownMenu}>
              {secondaryActions.map((action, index) => (
                <DropdownItem
                  key={index}
                  onClick={action.action}
                  className={action.variant === 'danger' ? styles.dangerAction : ''}
                >
                  {action.icon}
                  {action.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        )}
      </div>
    </div>
  );
};

export default CampaignActions;
