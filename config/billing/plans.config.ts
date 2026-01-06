import { SubscriptionPlan } from '../../enums/billing/subscription-plan.enum';
import { PlanConfig } from '../../types/billing/plan-config.type';

// Base subscription pricing
export const BASE_SUBSCRIPTION = {
  monthly: 30,
  annual: 21, // 30% discount: 30 * 0.7 = 21
  baseDriverSeats: 6,
  additionalSeatPrice: 10,
};

// Tiered per-employee fees
export const EMPLOYEE_TIER_PRICING = [
  { min: 0, max: 10, pricePerEmployee: 4 },
  { min: 11, max: 50, pricePerEmployee: 3 },
  { min: 51, max: Infinity, pricePerEmployee: 2 },
];

// AI Agent SMS/Call Campaigns pricing tiers
export const AI_AGENT_PLANS = {
  STARTER: {
    name: 'Starter',
    price: { monthly: 150, annual: 105 }, // 30% discount
    credits: 300,
    personas: 1,
    flows: 3,
    phoneLines: 1,
    additionalCredits: { amount: 25, price: 10 },
  },
  STANDARD: {
    name: 'Standard',
    price: { monthly: 380, annual: 266 }, // 30% discount
    credits: 1000,
    personas: 5,
    flows: 10,
    phoneLines: 3,
    additionalCredits: { amount: 30, price: 10 },
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: { monthly: 780, annual: 546 }, // 30% discount
    credits: 2500,
    personas: -1, // unlimited
    flows: -1, // unlimited
    phoneLines: 7,
    customIntegration: true,
    additionalCredits: { amount: 35, price: 10 },
  },
};

// MVR Record pricing
export const MVR_RECORD_PRICE = 5; // $5 per record

// Legacy plan configs (keeping for backwards compatibility)
export const PLAN_CONFIGS: Record<SubscriptionPlan, PlanConfig> = {
  [SubscriptionPlan.BASIC]: {
    plan: SubscriptionPlan.BASIC,
    name: 'Basic',
    description: 'Perfect for small fleets getting started',
    price: {
      monthly: 30,
      annual: 21, // 30% discount
    },
    stripe_price_ids: {
      monthly: process.env.STRIPE_PRICE_BASIC_MONTHLY || '',
      annual: process.env.STRIPE_PRICE_BASIC_ANNUAL || '',
    },
    limits: {
      max_active_jobs: 5,
      max_users: 3,
      max_applicants_per_month: 100,
    },
    features: [
      { name: 'Up to 6 Driver Employees', included: true },
      { name: 'Additional Seats', included: '$10/user' },
      { name: 'Email Support', included: true },
      { name: 'Basic Analytics', included: true },
      { name: 'Auto Recruiting', included: 'Add-on' },
      { name: 'AI Agent Campaigns', included: 'Add-on' },
    ],
    cta: 'Get Started',
  },
  [SubscriptionPlan.PRO]: {
    plan: SubscriptionPlan.PRO,
    name: 'Pro',
    description: 'For growing companies with higher volume',
    price: {
      monthly: 30,
      annual: 21,
    },
    stripe_price_ids: {
      monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || '',
      annual: process.env.STRIPE_PRICE_PRO_ANNUAL || '',
    },
    limits: {
      max_active_jobs: 20,
      max_users: 10,
      max_applicants_per_month: 500,
    },
    features: [
      { name: 'Up to 6 Driver Employees', included: true },
      { name: 'Additional Seats', included: '$10/user' },
      { name: 'Priority Email Support', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Auto Recruiting', included: 'Add-on' },
      { name: 'AI Agent Campaigns', included: 'Add-on' },
    ],
    popular: true,
    cta: 'Upgrade to Pro',
  },
  [SubscriptionPlan.ENTERPRISE]: {
    plan: SubscriptionPlan.ENTERPRISE,
    name: 'Enterprise',
    description: 'Custom solutions for large operations',
    price: {
      monthly: 30,
      annual: 21,
    },
    stripe_price_ids: {
      monthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || '',
      annual: process.env.STRIPE_PRICE_ENTERPRISE_ANNUAL || '',
    },
    limits: {
      max_active_jobs: -1, // unlimited
      max_users: -1,
      max_applicants_per_month: -1,
    },
    features: [
      { name: 'Unlimited Driver Employees', included: true },
      { name: 'Dedicated Support', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Custom Reporting', included: true },
      { name: 'Auto Recruiting', included: true },
      { name: 'AI Agent Campaigns', included: 'Custom Pricing' },
      { name: 'Custom Integrations', included: true },
    ],
    cta: 'Contact Sales',
  },
  [SubscriptionPlan.TRIAL]: {
    plan: SubscriptionPlan.TRIAL,
    name: 'Trial',
    description: '14-day free trial',
    price: {
      monthly: 0,
      annual: 0,
    },
    stripe_price_ids: {
      monthly: '',
      annual: '',
    },
    limits: {
      max_active_jobs: 2,
      max_users: 2,
      max_applicants_per_month: 20,
    },
    features: [
      { name: 'Up to 2 Driver Employees', included: true },
      { name: 'Email Support', included: true },
    ],
    cta: 'Start Trial',
  },
};
