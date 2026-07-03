import { ApiReference } from '@scalar/nextjs-api-reference'

export const GET = ApiReference({
  theme: 'kepler',
  spec: {
    url: '/openapi.json',
  },
})
