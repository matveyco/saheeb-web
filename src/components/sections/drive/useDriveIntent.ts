'use client';

import { useEffect, useState } from 'react';
import {
  DRIVE_WAITLIST_EVENT,
  type DriveWaitlistEventDetail,
} from '@/components/sections/drive/events';

export type DriveIntent = 'buyer' | 'seller';

export function useDriveIntent(defaultIntent: DriveIntent = 'buyer') {
  const [eventIntent, setEventIntent] = useState<DriveIntent | null>(null);
  const intent = eventIntent ?? defaultIntent;

  useEffect(() => {
    const handleIntentChange = (event: Event) => {
      const customEvent = event as CustomEvent<DriveWaitlistEventDetail>;
      if (customEvent.detail?.intent) {
        setEventIntent(customEvent.detail.intent);
      }
    };

    window.addEventListener(
      DRIVE_WAITLIST_EVENT,
      handleIntentChange as EventListener
    );

    return () => {
      window.removeEventListener(
        DRIVE_WAITLIST_EVENT,
        handleIntentChange as EventListener
      );
    };
  }, []);

  return {
    intent,
    setIntent: setEventIntent,
  };
}
