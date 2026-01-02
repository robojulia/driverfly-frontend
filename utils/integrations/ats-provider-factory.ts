import { ATSProvider } from '../../enums/integrations/ats-provider.enum';
import { IATSProvider } from '../../models/integrations/ats-provider.interface';
import { TenstreetProvider } from '../../models/integrations/providers/tenstreet/tenstreet-provider';

/**
 * Factory for creating ATS provider instances
 * Follows the Factory pattern to instantiate the correct provider based on type
 */
export class ATSProviderFactory {
  /**
   * Create an instance of the appropriate ATS provider
   * @param provider The ATS provider type
   * @returns An instance implementing IATSProvider
   * @throws Error if provider type is not supported
   */
  static create(provider: ATSProvider): IATSProvider {
    switch (provider) {
      case ATSProvider.TENSTREET:
        return new TenstreetProvider();

      case ATSProvider.GREENHOUSE:
        throw new Error('Greenhouse provider not yet implemented. Coming soon!');

      case ATSProvider.LEVER:
        throw new Error('Lever provider not yet implemented. Coming soon!');

      case ATSProvider.WORKDAY:
        throw new Error('Workday provider not yet implemented. Coming soon!');

      default:
        throw new Error(`Unknown ATS provider: ${provider}`);
    }
  }

  /**
   * Check if a provider is implemented
   */
  static isImplemented(provider: ATSProvider): boolean {
    return provider === ATSProvider.TENSTREET;
  }

  /**
   * Get list of all implemented providers
   */
  static getImplementedProviders(): ATSProvider[] {
    return [ATSProvider.TENSTREET];
  }

  /**
   * Get list of all providers (including not yet implemented)
   */
  static getAllProviders(): ATSProvider[] {
    return Object.values(ATSProvider);
  }
}
