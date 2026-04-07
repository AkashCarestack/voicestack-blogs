import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export type LegalMarkdownProps = {
  children: string
}

/**
 * Renders legal Markdown with the same BEM classes as hand-written legal pages.
 *
 * Authoring conventions (match `terms-body.md` header):
 * - `##` — main numbered sections (e.g. "1. Definitions")
 * - `###` — subclauses (e.g. "2.1 Provision and Availability.")
 * - Body paragraphs — normal text; use `**bold**` for inline emphasis
 * - Lists — `-` items for `ul` / `li` styling
 */
const components: Components = {
  h1: ({ node: _n, ...props }) => (
    <h1 className="legal__section-title" {...props} />
  ),
  h2: ({ node: _n, ...props }) => (
    <h2 className="legal__section-title" {...props} />
  ),
  h3: ({ node: _n, ...props }) => (
    <h3 className="legal__section-sub-title" {...props} />
  ),
  h4: ({ node: _n, ...props }) => (
    <h3 className="legal__section-sub-title" {...props} />
  ),
  p: ({ node: _n, ...props }) => <p className="legal__text" {...props} />,
  ul: ({ node: _n, ...props }) => (
    <ul className="legal__list" {...props} />
  ),
  ol: ({ node: _n, ...props }) => (
    <ol className="legal__list" {...props} />
  ),
  li: ({ node: _n, ...props }) => (
    <li className="legal__list-item" {...props} />
  ),
  a: ({ node: _n, ...props }) => (
    <a
      className="text-blue-600 underline hover:underline"
      {...props}
    />
  ),
  table: ({ node: _n, ...props }) => (
    <table className="legal__table w-full border-collapse" {...props} />
  ),
}

export function LegalMarkdown({ children }: LegalMarkdownProps) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  )
}

export default LegalMarkdown
