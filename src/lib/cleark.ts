import { Clerk } from "@clerk/backend";
import { config } from '../env'

export const clerkClient = Clerk({
    secretKey: config.CLERK_SECRET_KEY,
  });
  export const clearkClientCustomer = Clerk({
    secretKey:config.CLERK_SECRET_KEY_CUSTOMER
  });

