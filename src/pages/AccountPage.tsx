import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { demoModeEnabled } from '@/lib/shopify';

// Use the same env var as the rest of the Shopify integration
const SHOPIFY_STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN as string | undefined;

export default function AccountPage() {
  const handleLogin = () => {
    if (demoModeEnabled() || !SHOPIFY_STORE_DOMAIN) {
      toast.info('Demo Mode', {
        description: 'Connect a Shopify store to enable accounts.',
      });
      return;
    }
    window.open(`https://${SHOPIFY_STORE_DOMAIN}/account/login`, '_blank');
  };

  const handleCreateAccount = () => {
    if (demoModeEnabled() || !SHOPIFY_STORE_DOMAIN) {
      toast.info('Demo Mode', {
        description: 'Connect a Shopify store to enable accounts.',
      });
      return;
    }
    window.open(`https://${SHOPIFY_STORE_DOMAIN}/account/register`, '_blank');
  };

  return (
    <Layout>
      <Helmet>
        <title>Account — VOID™</title>
        <meta name="description" content="Sign in or create a VOID™ account to track orders and manage your profile." />
      </Helmet>

      <section className="page-padding py-20">
        <div className="max-w-sm mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-sm uppercase mb-2">Account</h1>
            <p className="text-xs text-muted-foreground">
              Sign in to view your orders and manage your account.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleLogin}
              className="w-full h-12 uppercase"
            >
              Sign In
            </Button>
            
            <Button 
              onClick={handleCreateAccount}
              variant="outline"
              className="w-full h-12 uppercase"
            >
              Create Account
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            You'll be redirected to our secure checkout portal.
          </p>
        </div>
      </section>
    </Layout>
  );
}
