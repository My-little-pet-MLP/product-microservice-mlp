import stripe from "stripe"
import { config } from "../env"

export const stripeInstance = new stripe(config.STRIPE_KEY)