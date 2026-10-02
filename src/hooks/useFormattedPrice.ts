import { useLocaleStore } from '@/stores/localeStore';

export function useFormattedPrice() {
  const { selectedLocale } = useLocaleStore();

  const formatPrice = (amount: string, currencyCode?: string): string => {
    // Always display prices in Indian Rupees
    const currency = 'INR';
    
    return new Intl.NumberFormat(selectedLocale.locale, {
      style: 'currency',
      currency: currency,
    }).format(parseFloat(amount));
  };

  return { formatPrice, selectedLocale };
}
