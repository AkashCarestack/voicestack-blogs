// Utility functions for revalidation

export interface RevalidationResult {
  success: boolean
  path: string
  error?: string
}

export async function revalidatePage(path: string): Promise<RevalidationResult> {
  try {
    const response = await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path,
        secret: process.env.REVALIDATE_SECRET
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return {
      success: true,
      path,
      ...result
    }
  } catch (error) {
    return {
      success: false,
      path,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function revalidateMultiplePages(paths: string[]): Promise<RevalidationResult[]> {
  const promises = paths.map(path => revalidatePage(path))
  return Promise.all(promises)
}

// Predefined revalidation paths for different content types
export const REVALIDATION_PATHS = {
  HOME: ['/'],
  WHO_WE_SERVE: ['/who-we-serve', '/who-we-serve/index'],
  FEATURES: ['/features', '/features/index'],
  SYSTEM_REQUIREMENTS: ['/system-requirements'],
  ALL: ['/', '/who-we-serve', '/who-we-serve/index', '/features', '/features/index', '/system-requirements']
} as const

export async function revalidateByContentType(contentType: keyof typeof REVALIDATION_PATHS): Promise<RevalidationResult[]> {
  const paths = [...REVALIDATION_PATHS[contentType]]
  return revalidateMultiplePages(paths)
}
