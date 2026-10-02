import { useLocaleStore } from '@/stores/localeStore';

export function useFormattedPrice() {
  const { selectedLocale } = useLocaleStore();

  const formatPrice = (amount: string, currencyCode?: string): string => {
    // Use the currency code from the product/API if provided (Shopify returns correct currency)
    // Otherwise fall back to the selected locale's currency
    const currency = currencyCode || selectedLocale.currencyCode;
    
    return new Intl.NumberFormat(selectedLocale.locale, {
      style: 'currency',
      currency: currency,
    }).format(parseFloat(amount));
  };

  return { formatPrice, selectedLocale };
}
