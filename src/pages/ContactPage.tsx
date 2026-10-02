import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Loader2, CheckCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const INQUIRY_TYPES = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'orders', label: 'Orders & Shipping' },
  { value: 'returns', label: 'Returns & Exchanges' },
  { value: 'press', label: 'Press & Media' },
  { value: 'wholesale', label: 'Wholesale & Partnerships' },
  { value: 'careers', label: 'Careers' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: '',
    orderNumber: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success('Message sent successfully!');
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      inquiryType: '',
      orderNumber: '',
      message: '',
    });
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <Layout>
        <Helmet>
          <title>Contact — VOID™</title>
          <meta name="description" content="Get in touch with VOID™ for inquiries and support." />
        </Helmet>

        <section className="page-padding py-20">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-sm mb-4">Message Sent</h1>
            <p className="text-xs text-muted-foreground mb-8">
              Thank you for reaching out. We'll get back to you within 24-48 hours.
            </p>
            <Button variant="outline" onClick={handleReset} className="text-xs">
              Send Another Message
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Contact — VOID™</title>
        <meta name="description" content="Get in touch with VOID™ for inquiries and support." />
      </Helmet>

      <section className="page-padding py-20">
        <div className="max-w-lg mx-auto">
          <h1 className="text-sm mb-2">Contact</h1>
          <p className="text-xs text-muted-foreground mb-8">
            Have a question or need assistance? We're here to help.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs uppercase">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="YOUR NAME"
                  required
                  className="h-12 text-xs uppercase placeholder:uppercase"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="YOUR@EMAIL.COM"
                  required
                  className="h-12 text-xs placeholder:uppercase"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inquiryType" className="text-xs uppercase">Inquiry Type</Label>
              <Select
                value={formData.inquiryType}
                onValueChange={(value) => handleChange('inquiryType', value)}
                required
              >
                <SelectTrigger className="h-12 text-xs uppercase">
                  <SelectValue placeholder="SELECT AN INQUIRY TYPE" />
                </SelectTrigger>
                <SelectContent>
                  {INQUIRY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="text-xs uppercase">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(formData.inquiryType === 'orders' || formData.inquiryType === 'returns') && (
              <div className="space-y-2">
                <Label htmlFor="orderNumber" className="text-xs uppercase">Order Number (optional)</Label>
                <Input
                  id="orderNumber"
                  type="text"
                  value={formData.orderNumber}
                  onChange={(e) => handleChange('orderNumber', e.target.value)}
                  placeholder="E.G., #1234"
                  className="h-12 text-xs uppercase placeholder:uppercase"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="message" className="text-xs uppercase">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                placeholder="HOW CAN WE HELP YOU?"
                required
                rows={5}
                className="resize-none text-xs placeholder:uppercase"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-xs uppercase"
              disabled={isSubmitting || !formData.inquiryType}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending
                </>
              ) : (
                'Send Message'
              )}
            </Button>
          </form>

          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground mb-4">Or reach us directly:</p>
            <div className="space-y-2">
              <a
                href="mailto:hello@void.com"
                className="block text-xs underline underline-offset-4 hover:text-muted-foreground transition-colors"
              >
                hello@void.com
              </a>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 pt-8 border-t border-border">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
              Frequently Asked Questions
            </h2>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="shipping">
                <AccordionTrigger className="text-xs text-left">
                  How long does shipping take?
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground">
                  Standard shipping takes 5-7 business days within the US. International orders typically arrive within 10-14 business days. Express shipping options are available at checkout for faster delivery.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="returns">
                <AccordionTrigger className="text-xs text-left">
                  What is your return policy?
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground">
                  We accept returns within 30 days of delivery for unworn items in original condition with tags attached. Returns are free for US customers. Please visit our Returns page to initiate a return.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sizing">
                <AccordionTrigger className="text-xs text-left">
                  How do I find my size?
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground">
                  Each product page includes a detailed size guide. Our pieces are designed with a relaxed, contemporary fit. If you're between sizes, we recommend sizing down for a more fitted look or sizing up for an oversized aesthetic.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tracking">
                <AccordionTrigger className="text-xs text-left">
                  How can I track my order?
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground">
                  Once your order ships, you'll receive an email with tracking information. You can also log into your account to view order status and tracking details at any time.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="international">
                <AccordionTrigger className="text-xs text-left">
                  Do you ship internationally?
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground">
                  Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination. Please note that customers are responsible for any customs duties or import taxes.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="care">
                <AccordionTrigger className="text-xs text-left">
                  How should I care for my items?
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground">
                  We recommend machine washing on cold with like colors and tumble drying on low. For best results, wash garments inside out. Specific care instructions are included on each product's label.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </Layout>
  );
}
