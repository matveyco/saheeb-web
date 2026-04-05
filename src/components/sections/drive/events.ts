export const DRIVE_WAITLIST_EVENT = 'saheeb-drive:open-waitlist';

export interface DriveWaitlistEventDetail {
  intent?: 'buyer' | 'seller';
  source?: string;
}

export function dispatchDriveWaitlistEvent(detail: DriveWaitlistEventDetail) {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<DriveWaitlistEventDetail>(DRIVE_WAITLIST_EVENT, {
      detail,
    })
  );
}
