import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// File storage is handled by ImageKit. No Cloudflare R2 binding is required.
export default defineCloudflareConfig();
