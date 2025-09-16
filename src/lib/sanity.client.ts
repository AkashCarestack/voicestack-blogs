import { createClient, type ClientConfig } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn, writeToken } from '~/lib/sanity.api'
import type { SanityClient } from 'next-sanity'

export function getClient(preview?: { token: string }): SanityClient {
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn,
    perspective: 'published',
  } as ClientConfig) as SanityClient

  if (preview) {
    if (!preview.token) {
      throw new Error('You must provide a token to preview drafts')
    }
    return client.withConfig({
      token: preview.token,
      useCdn: false,
      ignoreBrowserTokenWarning: true,
      perspective: 'previewDrafts',
    })
  }
  return client
}

export function getWriteClient(): SanityClient {
  if (!writeToken) {
    throw new Error('Write token is required for write operations')
  }
  
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: writeToken,
    perspective: 'published',
  } as ClientConfig) as SanityClient
}
