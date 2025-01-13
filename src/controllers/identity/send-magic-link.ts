import sendGrid, { MailDataRequired } from '@sendgrid/mail'
import config from '../../config/config'

export const sendMagicLink = async (email: string, token: string) => {
  const magicLink = `${config.apiBaseUrl}/verify?token=${token}`
  const message: MailDataRequired = {
    to: email,
    from: 'no-reply@amplifyhope.cc',
    templateId: config.sendGrid.magicLinkTemplateId,
    dynamicTemplateData: {
      Weblink: magicLink
    }
  }

  await sendGrid.send(message)
}
