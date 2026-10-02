import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface ShopifyCustomer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  acceptsMarketing: boolean;
  defaultAddress: {
    id: string;
    address1: string | null;
    address2: string | null;
    city: string | null;
    province: string | null;
    country: string | null;
    zip: string | null;
  } | null;
  orders: {
    edges: Array<{
      node: {
        id: string;
        orderNumber: number;
        processedAt: string;
        financialStatus: string;
        fulfillmentStatus: string;
        totalPrice: {
          amount: string;
          currencyCode: string;
        };
        lineItems: {
          edges: Array<{
            node: {
              title: string;
              quantity: number;
              variant: {
                image: {
                  url: string;
                  altText: string | null;
                } | null;
              } | null;
            };
          }>;
        };
      };
    }>;
  };
}

interface CustomerStore {
  customer: ShopifyCustomer | null;
  accessToken: string | null;
  expiresAt: string | null;
  isLoading: boolean;
  error: string | null;

  setCustomer: (customer: ShopifyCustomer | null) => void;
  setAccessToken: (token: string | null, expiresAt: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      customer: null,
      accessToken: null,
      expiresAt: null,
      isLoading: false,
      error: null,

      setCustomer: (customer) => set({ customer }),
      setAccessToken: (accessToken, expiresAt) => set({ accessToken, expiresAt }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      
      logout: () => set({ 
        customer: null, 
        accessToken: null, 
        expiresAt: null,
        error: null 
      }),

      isAuthenticated: () => {
        const { accessToken, expiresAt } = get();
        if (!accessToken || !expiresAt) return false;
        return new Date(expiresAt) > new Date();
      },
    }),
    {
      name: 'shopify-customer',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
