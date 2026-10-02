import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchAvailableCountries, setCurrentCountry, ShopifyCountry, demoModeEnabled } from '@/lib/shopify';

export interface LocaleOption {
  country: string;
  countryCode: string;
  currency: string;
  currencyCode: string;
  locale: string;
}

// Fallback demo options when Shopify is not connected
export const DEMO_LOCALE_OPTIONS: LocaleOption[] = [
  { country: 'United States', countryCode: 'US', currency: '$', currencyCode: 'USD', locale: 'en-US' },
  { country: 'United Kingdom', countryCode: 'GB', currency: '£', currencyCode: 'GBP', locale: 'en-GB' },
  { country: 'European Union', countryCode: 'DE', currency: '€', currencyCode: 'EUR', locale: 'de-DE' },
  { country: 'Canada', countryCode: 'CA', currency: 'C$', currencyCode: 'CAD', locale: 'en-CA' },
  { country: 'Australia', countryCode: 'AU', currency: 'A$', currencyCode: 'AUD', locale: 'en-AU' },
  { country: 'Japan', countryCode: 'JP', currency: '¥', currencyCode: 'JPY', locale: 'ja-JP' },
];

// Helper to convert Shopify country to LocaleOption
function shopifyCountryToLocaleOption(country: ShopifyCountry): LocaleOption {
  // Map country code to locale
  const localeMap: Record<string, string> = {
    US: 'en-US',
    GB: 'en-GB',
    DE: 'de-DE',
    FR: 'fr-FR',
    ES: 'es-ES',
    IT: 'it-IT',
    CA: 'en-CA',
    AU: 'en-AU',
    JP: 'ja-JP',
    NL: 'nl-NL',
    BE: 'nl-BE',
    AT: 'de-AT',
    CH: 'de-CH',
    IE: 'en-IE',
    NZ: 'en-NZ',
    SE: 'sv-SE',
    NO: 'nb-NO',
    DK: 'da-DK',
    FI: 'fi-FI',
    PT: 'pt-PT',
    BR: 'pt-BR',
    MX: 'es-MX',
    SG: 'en-SG',
    HK: 'zh-HK',
    KR: 'ko-KR',
    IN: 'en-IN',
    AE: 'ar-AE',
    SA: 'ar-SA',
    ZA: 'en-ZA',
    PL: 'pl-PL',
    CZ: 'cs-CZ',
    HU: 'hu-HU',
    RO: 'ro-RO',
    GR: 'el-GR',
  };

  return {
    country: country.name,
    countryCode: country.isoCode,
    currency: country.currency.symbol,
    currencyCode: country.currency.isoCode,
    locale: localeMap[country.isoCode] || 'en-US',
  };
}

interface LocaleStore {
  selectedLocale: LocaleOption;
  availableLocales: LocaleOption[];
  isLoading: boolean;
  hasFetchedFromShopify: boolean;
  setLocale: (locale: LocaleOption) => void;
  setAvailableLocales: (locales: LocaleOption[]) => void;
  fetchLocalesFromShopify: () => Promise<void>;
}

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set, get) => ({
      selectedLocale: DEMO_LOCALE_OPTIONS[2], // Default to EUR
      availableLocales: DEMO_LOCALE_OPTIONS,
      isLoading: false,
      hasFetchedFromShopify: false,

      setLocale: (locale) => {
        set({ selectedLocale: locale });
        // Sync with Shopify API context
        setCurrentCountry(locale.countryCode);
      },

      setAvailableLocales: (locales) => set({ availableLocales: locales }),

      fetchLocalesFromShopify: async () => {
        // Don't fetch if in demo mode or already fetched
        if (demoModeEnabled() || get().hasFetchedFromShopify) {
          return;
        }

        set({ isLoading: true });
        try {
          const countries = await fetchAvailableCountries();
          
          if (countries.length > 0) {
            const localeOptions = countries.map(shopifyCountryToLocaleOption);
            set({ 
              availableLocales: localeOptions,
              hasFetchedFromShopify: true,
            });

            // If current selection isn't in the new list, select the first one
            const current = get().selectedLocale;
            const existsInNew = localeOptions.some(l => l.countryCode === current.countryCode);
            if (!existsInNew && localeOptions.length > 0) {
              set({ selectedLocale: localeOptions[0] });
              setCurrentCountry(localeOptions[0].countryCode);
            } else {
              // Sync current selection with Shopify API
              setCurrentCountry(current.countryCode);
            }
          }
        } catch (error) {
          console.error('Failed to fetch locales from Shopify:', error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'locale-storage',
      partialize: (state) => ({ 
        selectedLocale: state.selectedLocale,
        hasFetchedFromShopify: state.hasFetchedFromShopify,
      }),
    }
  )
);

// Initialize country on store creation
const initialState = useLocaleStore.getState();
if (initialState.selectedLocale) {
  setCurrentCountry(initialState.selectedLocale.countryCode);
}

// Export for backwards compatibility
export const LOCALE_OPTIONS = DEMO_LOCALE_OPTIONS;
