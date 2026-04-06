export const DRIVE_WAITLIST_EVENT = 'saheeb-drive:open-waitlist';
export const DRIVE_INTENT_EVENT = 'saheeb-drive:set-intent';

export interface DriveWaitlistEventDetail {
  intent?: 'buyer' | 'seller';
  source?: string;
}

function dispatchDriveEvent(
  eventName: string,
  detail: DriveWaitlistEventDetail
) {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<DriveWaitlistEventDetail>(eventName, {
      detail,
    })
  );
}

export function dispatchDriveWaitlistEvent(detail: DriveWaitlistEventDetail) {
  dispatchDriveEvent(DRIVE_WAITLIST_EVENT, detail);
}

export function dispatchDriveIntentEvent(detail: DriveWaitlistEventDetail) {
  dispatchDriveEvent(DRIVE_INTENT_EVENT, detail);
}
