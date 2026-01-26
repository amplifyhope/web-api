import { Resend } from 'resend'
import config from '../../config/config'

const resend = new Resend(config.resend.apiKey)

export const sendMagicLink = async (email: string, stripeCustomerId: string, token: string) => {
  const magicLink = `${config.apiBaseUrl}/verify?token=${token}`

  await resend.emails.send({
    from: config.resend.email,
    to: email,
    template: {
      id: config.resend.templateId,
      variables: {
        MAGIC_LINK: magicLink
      }
    },
    tags: [{ name: 'environment', value: config.environment }, { name: 'stripe_customer_id', value: stripeCustomerId }]
  })
}
