import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

/**
 * Free Workers have a very small per-request CPU budget. Serve build-time
 * SSG output from Workers Static Assets and intercept cache hits before the
 * NextServer bundle is loaded. Dynamic admin/auth routes still use the Worker.
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
