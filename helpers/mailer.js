const mailer = require('@sendgrid/mail')

mailer.setApiKey(process.env.MAILER_API_KEY)

const templates = {
  emailVerification: 'd-957bbb04fe354480bf8d83fff94a21d6',
}

exports.sendEmailVerification = async (link, to) => {
  return mailer.send({
    to,
    from: process.env.MAILER_ID,
    templateId: templates.emailVerification,
    dynamicTemplateData: {
      Verification_Email: to,
      Activation_Link: link,
      Subject: 'New Registration Verification | Student Profile System',
    },
  })
}
