const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DEFAULT_CONTACT_TO_EMAIL = 'jerem.quiambao@gmail.com'

const escapeHtml = (value = '') =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, message: 'Method not allowed.' })
  }

  let body = {}

  if (typeof req.body === 'string') {
    try {
      body = JSON.parse(req.body || '{}')
    } catch (error) {
      return res.status(400).json({
        ok: false,
        message: 'Invalid request payload. Please try submitting the form again.',
      })
    }
  } else {
    body = req.body || {}
  }

  const name = body.name?.toString().trim() || ''
  const email = body.email?.toString().trim() || ''
  const subject = body.subject?.toString().trim() || ''
  const message = body.message?.toString().trim() || ''
  const companyWebsite = body.company_website?.toString().trim() || ''

  if (companyWebsite) {
    return res.status(200).json({ ok: true, message: 'Message received.' })
  }

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ ok: false, message: 'Please complete all required fields.' })
  }

  if (!EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ ok: false, message: 'Please enter a valid email address.' })
  }

  const resendApiKey = process.env.RESEND_API_KEY
  const contactToEmail = process.env.CONTACT_TO_EMAIL || DEFAULT_CONTACT_TO_EMAIL
  const contactFromEmail = process.env.CONTACT_FROM_EMAIL

  if (!resendApiKey || !contactFromEmail) {
    return res.status(500).json({
      ok: false,
      message:
        'Email service is not configured yet. Add RESEND_API_KEY and CONTACT_FROM_EMAIL in your Vercel environment variables.',
    })
  }

  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeSubject = escapeHtml(subject)
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>')

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: contactFromEmail,
        to: [contactToEmail],
        subject: `Portfolio Contact: ${subject}`,
        reply_to: email,
        html: `
          <h2>New Portfolio Contact</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Subject / Project Type:</strong> ${safeSubject}</p>
          <p><strong>Message:</strong><br>${safeMessage}</p>
        `,
        text: `New Portfolio Contact

Name: ${name}
Email: ${email}
Subject / Project Type: ${subject}

Message:
${message}`,
      }),
    })

    if (!resendResponse.ok) {
      const errorPayload = await resendResponse.text()
      let resendMessage = 'Resend request failed.'

      if (errorPayload) {
        try {
          const parsedPayload = JSON.parse(errorPayload)
          resendMessage =
            parsedPayload.message || parsedPayload.error || resendMessage
        } catch (parseError) {
          resendMessage = errorPayload
        }
      }

      throw new Error(resendMessage)
    }

    return res.status(200).json({ ok: true, message: 'Thanks! Your message has been sent.' })
  } catch (error) {
    console.error('Contact form error:', error)
    return res.status(500).json({ ok: false, message: 'Unable to send your message right now.' })
  }
}
