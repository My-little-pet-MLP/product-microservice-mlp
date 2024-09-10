import { createClerkClient } from '@clerk/backend'
import { config } from '../env'

export const clerkClient = createClerkClient({ secretKey:config.CLERK_SECRET_KEY })