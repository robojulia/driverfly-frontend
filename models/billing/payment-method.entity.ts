export class PaymentMethodEntity {
  id?: string; // Stripe payment method ID
  brand?: string; // visa, mastercard, etc.
  last4?: string;
  exp_month?: number;
  exp_year?: number;
  is_default?: boolean;
  billing_details?: {
    name?: string;
    email?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
  };
}
