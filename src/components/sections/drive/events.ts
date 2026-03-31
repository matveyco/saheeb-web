export const DRIVE_WAITLIST_EVENT = 'saheeb-drive:open-waitlist';

export interface DriveWaitlistEventDetail {
  intent?: 'buyer' | 'seller';
  source?: string;
}
