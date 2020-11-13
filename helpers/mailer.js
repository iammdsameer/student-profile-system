const mailer = require('@sendgrid/mail')

mailer.setApiKey(process.env.MAILER_API_KEY)

const templates = {
  emailVerification: 'd-957bbb04fe354480bf8d83fff94a21d6',
  forgotPasswordVerification: 'd-9840b22fd4584ddea32829acf2ec0ad0',
}

const subject = {
  newAccount: 'New Registration Verification | Student Profile System',
  recoverAccount: 'Password Reset Request | Student Profile System',
}

exports.sendEmailVerification = async (link, to, sub, type) => {
  return mailer.send({
    to,
    from: process.env.MAILER_ID,
    templateId: templates[type],
    dynamicTemplateData: {
      Verification_Email: to,
      Activation_Link: link,
      Subject: subject[sub],
    },
  })
}
