import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { getCookiePreferences, setCookiePreferences, type CookiePreferences as CookiePrefs } from './CookieConsent';

interface CookiePreferencesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CookiePreferences({ open, onOpenChange }: CookiePreferencesProps) {
  const [preferences, setPreferences] = useState<CookiePrefs>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    if (open) {
      const stored = getCookiePreferences();
      if (stored) {
        setPreferences(stored);
      }
    }
  }, [open]);

  const handleSave = () => {
    setCookiePreferences(preferences);
    onOpenChange(false);
  };

  const cookieTypes = [
    {
      id: 'essential',
      name: 'Essential',
      description: 'Required for the website to function. Cannot be disabled.',
      disabled: true,
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Help us understand how visitors interact with our website.',
      disabled: false,
    },
    {
      id: 'marketing',
      name: 'Marketing',
      description: 'Used to deliver personalized advertisements.',
      disabled: false,
    },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm">Cookie Preferences</DialogTitle>
          <DialogDescription className="text-xs">
            Manage your cookie settings. Essential cookies cannot be disabled.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {cookieTypes.map((cookie) => (
            <div key={cookie.id} className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs font-medium">{cookie.name}</p>
                <p className="text-[10px] text-muted-foreground">{cookie.description}</p>
              </div>
              <Switch
                checked={preferences[cookie.id]}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, [cookie.id]: checked }))
                }
                disabled={cookie.disabled}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
