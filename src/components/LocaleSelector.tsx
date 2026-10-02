import { useState, useEffect } from 'react';
import { useLocaleStore, LocaleOption, DEMO_LOCALE_OPTIONS } from '@/stores/localeStore';
import { demoModeEnabled } from '@/lib/shopify';

const LOCALE_SELECTED_KEY = 'locale-selected';

export default function LocaleSelector() {
  const [isVisible, setIsVisible] = useState(false);
  const { setLocale, availableLocales, fetchLocalesFromShopify, isLoading } = useLocaleStore();

  useEffect(() => {
    const hasSelected = localStorage.getItem(LOCALE_SELECTED_KEY);
    if (!hasSelected) {
      // Fetch locales from Shopify if connected
      if (!demoModeEnabled()) {
        fetchLocalesFromShopify();
      }
      // Small delay for smoother UX
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, [fetchLocalesFromShopify]);

  const handleSelect = (option: LocaleOption) => {
    setLocale(option);
    localStorage.setItem(LOCALE_SELECTED_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  // Use available locales from store (dynamic from Shopify or demo fallback)
  const locales = availableLocales.length > 0 ? availableLocales : DEMO_LOCALE_OPTIONS;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-foreground/40 animate-fade-in" />
      
      {/* Modal */}
      <div className="relative bg-background border border-border w-full max-w-sm mx-4 animate-fade-in">
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-sm uppercase tracking-wide">Select Your Region</h2>
            <p className="text-xs text-muted-foreground">
              Choose your country to see prices in your local currency.
            </p>
          </div>

          {isLoading ? (
            <div className="py-8 text-center">
              <p className="text-xs text-muted-foreground">Loading regions...</p>
            </div>
          ) : (
            <ul className="space-y-1 max-h-[60vh] overflow-y-auto">
              {locales.map((option) => (
                <li key={option.countryCode}>
                  <button
                    onClick={() => handleSelect(option)}
                    className="w-full text-left py-3 px-4 text-sm hover:bg-muted transition-colors border border-transparent hover:border-border"
                  >
                    <span className="flex items-center justify-between">
                      <span className="uppercase">{option.country}</span>
                      <span className="text-muted-foreground">{option.currency} ({option.currencyCode})</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
