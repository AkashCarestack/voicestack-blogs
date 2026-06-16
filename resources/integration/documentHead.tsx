import { REGIONAL_RESOURCES_URL_GUARD_SCRIPT } from '~/resources/utils/resourcesPublicPath'

export function ResourcesDocumentHead() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: REGIONAL_RESOURCES_URL_GUARD_SCRIPT,
      }}
    />
  )
}
