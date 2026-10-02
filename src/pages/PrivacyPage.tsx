import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";

const PrivacyPage = () => {
  return (
    <Layout>
      <Helmet>
        <title>Privacy Policy | VOID™</title>
        <meta name="description" content="Privacy policy for VOID™ store." />
      </Helmet>
      
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-base font-normal mb-8">Privacy Policy</h1>
          
          <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-foreground mb-3">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This may include your name, email address, postal address, phone number, and payment information.
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-3">2. How We Use Your Information</h2>
              <p>
                We use the information we collect to process your orders, communicate with you about your purchases, send you marketing communications (with your consent), improve our services, and comply with legal obligations.
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-3">3. Information Sharing</h2>
              <p>
                We do not sell your personal information. We may share your information with service providers who assist us in operating our business, such as payment processors and shipping carriers. We may also disclose information when required by law.
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-3">4. Cookies</h2>
              <p>
                We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookies through your browser settings, though disabling them may affect site functionality.
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-3">5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-3">6. Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal information. You may also object to or restrict certain processing of your data. To exercise these rights, please contact us at privacy@void.com.
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-3">7. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes for which it was collected, including to satisfy legal, accounting, or reporting requirements.
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-3">8. Updates to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the effective date.
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-3">9. Contact</h2>
              <p>
                For any questions about this privacy policy, please contact us at privacy@void.com.
              </p>
            </section>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default PrivacyPage;
