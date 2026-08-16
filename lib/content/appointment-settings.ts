import { getContentOverride } from '@/lib/content/overrides';
import {
  DEFAULT_APPOINTMENT_SETTINGS,
  type AppointmentSettings,
} from '@/lib/appointment-settings-shared';

export type { AppointmentSettings } from '@/lib/appointment-settings-shared';
export { DEFAULT_APPOINTMENT_SETTINGS, appointmentSettingsLabel } from '@/lib/appointment-settings-shared';

export async function getAppointmentSettings(): Promise<AppointmentSettings> {
  return getContentOverride<AppointmentSettings>('appointment_settings', DEFAULT_APPOINTMENT_SETTINGS);
}
