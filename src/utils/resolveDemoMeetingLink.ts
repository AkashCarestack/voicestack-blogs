/** Above this count, use `demoMeetingLink2` when set (DSO / multi-location flow). */
export const DSO_LOCATION_THRESHOLD = 14

export type DemoMeetingRow = {
  demoMeetingLink?: string
  demoMeetingLink2?: string
} | null | undefined

export function parseLocationsParam(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined
  const raw = Array.isArray(value) ? value[0] : value
  const n = typeof raw === 'number' ? raw : parseInt(String(raw), 10)
  if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) return undefined
  return n
}

export function hasSecondaryMeetingLink(row: DemoMeetingRow): boolean {
  return Boolean(row?.demoMeetingLink2?.trim())
}

/** True when CMS has a second meeting link and we do not yet have a valid location count. */
export function needsLocationPrompt(
  row: DemoMeetingRow,
  locations: number | undefined
): boolean {
  if (!hasSecondaryMeetingLink(row)) return false
  return locations === undefined
}

/**
 * Picks HubSpot meeting URL. When `demoMeetingLink2` is set, requires `locations`;
 * otherwise returns primary link only.
 */
export function resolveDemoMeetingLink(
  row: DemoMeetingRow,
  locations: number | undefined
): string | undefined {
  if (!row) return undefined
  const link1 = row.demoMeetingLink?.trim()
  const link2 = row.demoMeetingLink2?.trim()
  if (!link2) return link1 || undefined
  if (locations === undefined) return undefined
  if (locations > DSO_LOCATION_THRESHOLD) return link2 || link1
  return link1 || link2
}
