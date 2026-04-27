export const LOC_QUERY_PARAM = 'loc'
export type LocCategory = 'lt15' | '15plus'

export type DemoMeetingRow = {
  demoMeetingLink?: string
  demoMeetingLink2?: string
} | null | undefined

export function parseLocParam(value: unknown): LocCategory | undefined {
  if (value === undefined || value === null || value === '') return undefined
  const raw = Array.isArray(value) ? value[0] : value
  return raw === 'lt15' || raw === '15plus' ? raw : undefined
}

export function hasSecondaryMeetingLink(row: DemoMeetingRow): boolean {
  return Boolean(row?.demoMeetingLink2?.trim())
}

export function resolveDemoMeetingLink(
  row: DemoMeetingRow,
  loc: LocCategory | undefined
): string | undefined {
  if (!row) return undefined
  const link1 = row.demoMeetingLink?.trim()
  const link2 = row.demoMeetingLink2?.trim()
  if (!link2) return link1 || undefined
  if (loc === '15plus') return link2 || link1
  return link1 || link2
}

/**
 * HubSpot meetings iframe always uses `embed=true` and preserves existing query params.
 */
export function buildHubspotMeetingEmbedUrl(meetingLink: string): string {
  const url = new URL(meetingLink)
  url.searchParams.set('embed', 'true')
  return url.toString()
}
