

export type Project = {
  name: string,
  slug: string,
  tagline: string,
  highlight: string,
  status: string,
  period: string,
  github: string,
  demo: string,
  
  // Story telling
  context: string,
  description: string,
  problem: {
    title: string,
    small: string,
    content: string,
  },
  solution: {
    title: string,
    small: string,
    content: string,
  },
  impact: string,

  // Tech
  technicalDetails: {
    title: string,
    content: string,
    highlights: string[],
  },
  features: {
    name: string,
    description: string
  }[],
  stack: {
    name: string,
    category: string
  }[],
  achievements: string[],
}