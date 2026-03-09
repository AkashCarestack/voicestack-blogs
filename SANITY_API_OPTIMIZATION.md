# Sanity API Request Optimization - Issues Found & Fixes Applied

## Critical Issues Identified

### 1. ✅ FIXED: CDN Disabled (`useCdn: false`)
**Location:** `src/lib/sanity.api.ts`

**Problem:** 
- `useCdn` was set to `false`, meaning ALL API requests bypassed the CDN
- CDN requests are FREE and don't count against your API quota
- Direct API requests count against your 250k/month limit

**Impact:** This was the **biggest issue** - every single API request was counting against your quota instead of using the free CDN.

**Fix Applied:**
- Changed `useCdn` to `process.env.NODE_ENV === 'production'`
- CDN is now enabled in production (free, doesn't count against quota)
- CDN remains disabled in development for fresh data

### 2. ✅ FIXED: Client-Side Search API Calls
**Location:** `src/pages/search.tsx`

**Problem:**
- Search page was making direct Sanity API calls from the browser
- Even with CDN enabled, client-side calls expose API keys and count against quota
- Every search query made 2 API requests directly from the browser

**Fix Applied:**
- Created server-side API route: `src/pages/api/search.ts`
- Updated search page to call the API route instead of Sanity directly
- All search requests now go through server-side (can use CDN, more secure)

### 3. ⚠️ IDENTIFIED: `getInitialProps` in `_app.tsx` Makes 5 API Calls Per Page Navigation
**Location:** `src/pages/_app.tsx` (lines 230-280)

**Problem:**
- `getInitialProps` runs on EVERY page navigation (both server and client-side)
- Makes 5 API calls on every page load:
  1. `getHeaderData(client, locale)`
  2. `getFooterData(client, locale)`
  3. `client.fetch(getALLSiteSettings(locale))`
  4. `getContactData(client, locale)`
  5. `getDemoFormData(client, locale)`

**Impact:** 
- If users navigate between 10 pages, that's 50 API requests
- With CDN enabled, this is better, but still could be optimized

**Recommendation (Not Yet Fixed):**
- Consider caching layout data (header/footer/settings) since they rarely change
- Or move to `getServerSideProps` with caching headers
- Or use Next.js middleware to fetch once per session
- Layout data could be cached for 5-10 minutes since it changes infrequently

### 4. ✅ VERIFIED: No Other Client-Side API Calls
- Checked all components and pages
- Only `PreviewProvider` uses LiveQuery (only in draft/preview mode, not production)
- `src/lib/sanity.ts` is only used server-side for slug validation in Sanity Studio

## Expected Impact

### Before Fixes:
- Every API request counted against quota (250k/month)
- Client-side search calls exposed API keys
- No CDN usage = higher costs

### After Fixes:
- **CDN enabled** = Most requests now use free CDN (don't count against quota)
- **Search moved to server-side** = More secure, can use CDN
- **Remaining issue:** `getInitialProps` still makes 5 calls per navigation, but now with CDN

## Next Steps (Optional Optimizations)

1. **Cache Layout Data:**
   - Header/Footer/Settings data rarely changes
   - Could cache for 5-10 minutes
   - Would reduce API calls significantly

2. **Monitor API Usage:**
   - Check Sanity dashboard after deployment
   - Should see significant reduction in API requests
   - CDN requests won't show in API quota

3. **Consider ISR (Incremental Static Regeneration):**
   - For pages that don't change often
   - Reduces server-side API calls

## Testing Recommendations

1. Deploy to production
2. Monitor Sanity API usage in dashboard
3. Verify search functionality still works
4. Check that CDN is being used (requests should be faster)

## Files Modified

1. ✅ `src/lib/sanity.api.ts` - Enabled CDN for production
2. ✅ `src/pages/search.tsx` - Removed client-side Sanity calls
3. ✅ `src/pages/api/search.ts` - New server-side search API route
4. ✅ `src/pages/phone-system/features/[slug].tsx` - Changed `fallback: 'blocking'` to `fallback: false`
5. ✅ `src/pages/phone-system/comparison/[slug].tsx` - Changed `fallback: 'blocking'` to `fallback: false`
6. ✅ `src/pages/company/partners/[slug].tsx` - Changed `fallback: 'blocking'` to `fallback: false`

## Additional Fix: Removed `fallback: 'blocking'`

**Problem:**
- `fallback: 'blocking'` causes Next.js to generate pages on-demand when users visit pages not pre-generated at build time
- This triggers Sanity API calls on the server for every new/uncached page visit
- Even with CDN, this was a source of unnecessary API requests

**Fix Applied:**
- Changed `fallback: 'blocking'` to `fallback: false` in all dynamic pages
- Now only pre-generated pages are served
- New pages added to Sanity will return 404 until the next build
- Since you have webhooks set up (`/api/sanity-webhook.ts`), content changes trigger revalidation automatically

**Impact:**
- Eliminates on-demand page generation API calls
- New content requires webhook-triggered rebuild (which you already have)
- Slight delay for new content, but eliminates unexpected API usage
