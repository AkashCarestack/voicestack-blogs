import { getClient } from './sanity.client'

// Content Management Data Adapters
export const dataAdapters = {
  // Testimonials
  testimonials: {
    // Get all testimonials with author data
    getAll: `
      *[_type == "centralizedTestimonial"] | order(publishedAt desc) {
        _id,
        title,
        quote,
        rating,
        category,
        featured,
        publishedAt,
        tags,
        author-> {
          _id,
          name,
          position,
          company,
          bio,
          avatar,
          socialLinks
        }
      }
    `,
    
    // Get featured testimonials only
    getFeatured: `
      *[_type == "centralizedTestimonial" && featured == true] | order(publishedAt desc) {
        _id,
        title,
        quote,
        rating,
        category,
        featured,
        publishedAt,
        tags,
        author-> {
          _id,
          name,
          position,
          company,
          bio,
          avatar,
          socialLinks
        }
      }
    `,
    
    // Get testimonials by category
    getByCategory: `
      *[_type == "centralizedTestimonial" && category == $category] | order(publishedAt desc) {
        _id,
        title,
        quote,
        rating,
        category,
        featured,
        publishedAt,
        tags,
        author-> {
          _id,
          name,
          position,
          company,
          bio,
          avatar,
          socialLinks
        }
      }
    `,
    
    // Get testimonials by IDs (for component references)
    getByIds: `
      *[_type == "centralizedTestimonial" && _id in $ids] {
        _id,
        title,
        quote,
        rating,
        category,
        featured,
        publishedAt,
        tags,
        author-> {
          _id,
          name,
          position,
          company,
          bio,
          avatar,
          socialLinks
        }
      }
    `,
  },

  // Features
  features: {
    // Get all features
    getAll: `
      *[_type == "featureItem"] | order(priority asc, title asc) {
        _id,
        title,
        slug,
        description,
        icon,
        category,
        benefits,
        link,
        priority,
        tags
      }
    `,
    
    // Get features by category
    getByCategory: `
      *[_type == "featureItem" && category == $category] | order(priority asc, title asc) {
        _id,
        title,
        slug,
        description,
        icon,
        category,
        benefits,
        link,
        priority,
        tags
      }
    `,
    
    // Get features by priority
    getByPriority: `
      *[_type == "featureItem" && priority == $priority] | order(title asc) {
        _id,
        title,
        slug,
        description,
        icon,
        category,
        benefits,
        link,
        priority,
        tags
      }
    `,
    
    // Get features by IDs (for component references)
    getByIds: `
      *[_type == "featureItem" && _id in $ids] {
        _id,
        title,
        slug,
        description,
        icon,
        category,
        benefits,
        link,
        priority,
        tags
      }
    `,
  },

  // Authors
  authors: {
    // Get all authors
    getAll: `
      *[_type == "author"] | order(name asc) {
        _id,
        name,
        slug,
        position,
        company,
        bio,
        avatar,
        socialLinks
      }
    `,
    
    // Get author by slug
    getBySlug: `
      *[_type == "author" && slug.current == $slug][0] {
        _id,
        name,
        slug,
        position,
        company,
        bio,
        avatar,
        socialLinks
      }
    `,
    
    // Get authors by company
    getByCompany: `
      *[_type == "author" && company == $company] | order(name asc) {
        _id,
        name,
        slug,
        position,
        company,
        bio,
        avatar,
        socialLinks
      }
    `,
  },
}

// Helper functions to fetch data using the adapters
export const fetchContent = {
  // Testimonials
  async getAllTestimonials() {
    const client = getClient()
    return await client.fetch(dataAdapters.testimonials.getAll)
  },

  async getFeaturedTestimonials() {
    const client = getClient()
    return await client.fetch(dataAdapters.testimonials.getFeatured)
  },

  async getTestimonialsByCategory(category: string) {
    const client = getClient()
    return await client.fetch(dataAdapters.testimonials.getByCategory, { category })
  },

  async getTestimonialsByIds(ids: string[]) {
    const client = getClient()
    return await client.fetch(dataAdapters.testimonials.getByIds, { ids })
  },

  // Features
  async getAllFeatures() {
    const client = getClient()
    return await client.fetch(dataAdapters.features.getAll)
  },

  async getFeaturesByCategory(category: string) {
    const client = getClient()
    return await client.fetch(dataAdapters.features.getByCategory, { category })
  },

  async getFeaturesByPriority(priority: number) {
    const client = getClient()
    return await client.fetch(dataAdapters.features.getByPriority, { priority })
  },

  async getFeaturesByIds(ids: string[]) {
    const client = getClient()
    return await client.fetch(dataAdapters.features.getByIds, { ids })
  },

  // Authors
  async getAllAuthors() {
    const client = getClient()
    return await client.fetch(dataAdapters.authors.getAll)
  },

  async getAuthorBySlug(slug: string) {
    const client = getClient()
    return await client.fetch(dataAdapters.authors.getBySlug, { slug })
  },

  async getAuthorsByCompany(company: string) {
    const client = getClient()
    return await client.fetch(dataAdapters.authors.getByCompany, { company })
  },
}

// Component data resolvers for use in pages
export const componentDataResolvers = {
  // Resolve testimonial component data
  async resolveTestimonialComponent(component: any) {
    if (!component.testimonials || component.testimonials.length === 0) {
      return component
    }

    // Get testimonial IDs from references
    const testimonialIds = component.testimonials.map((ref: any) => ref._ref).filter(Boolean)
    
    if (testimonialIds.length === 0) {
      return component
    }

    // Fetch actual testimonial data
    const testimonials = await fetchContent.getTestimonialsByIds(testimonialIds)
    
    // Apply filters if specified
    let filteredTestimonials = testimonials
    
    if (component.filterByCategory && component.filterByCategory !== 'all') {
      filteredTestimonials = testimonials.filter((t: any) => t.category === component.filterByCategory)
    }
    
    if (component.featuredOnly) {
      filteredTestimonials = filteredTestimonials.filter((t: any) => t.featured)
    }

    return {
      ...component,
      resolvedTestimonials: filteredTestimonials
    }
  },

  // Resolve feature grid component data
  async resolveFeatureGridComponent(component: any) {
    if (!component.features || component.features.length === 0) {
      return component
    }

    // Get feature IDs from references
    const featureIds = component.features.map((ref: any) => ref._ref).filter(Boolean)
    
    if (featureIds.length === 0) {
      return component
    }

    // Fetch actual feature data
    let features = await fetchContent.getFeaturesByIds(featureIds)
    
    // Apply filters if specified
    if (component.filterByCategory && component.filterByCategory !== 'all') {
      features = features.filter((f: any) => f.category === component.filterByCategory)
    }
    
    // Apply sorting
    if (component.sortBy === 'priority') {
      features.sort((a: any, b: any) => a.priority - b.priority)
    } else if (component.sortBy === 'title') {
      features.sort((a: any, b: any) => a.title.localeCompare(b.title))
    } else if (component.sortBy === 'category') {
      features.sort((a: any, b: any) => (a.category || '').localeCompare(b.category || ''))
    }

    return {
      ...component,
      resolvedFeatures: features
    }
  }
}

