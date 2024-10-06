import { createClerkClient } from '@clerk/backend'
import { config } from '../env'

export const clerkClient = createClerkClient({ secretKey:config.CLERK_SECRET_KEY })

export const clearkClientCustomer = createClerkClient({secretKey:config.CLERK_SECRET_KEY_CUSTOMER})