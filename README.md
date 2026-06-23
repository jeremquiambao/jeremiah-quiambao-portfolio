# Jeremiah Quiambao Portfolio

Static portfolio site with a Vercel-style serverless contact endpoint in `api/contact.js`.

## Project structure

- `index.html`: homepage
- `projects/web/*.html`: web project case studies
- `projects/design/*.html`: design project case studies
- `projects/automation/*.html`: automation project case studies
- `api/contact.js`: contact form serverless endpoint
- `assets/css`: shared styles
- `assets/js`: shared interactions
- `assets/img`: shared brand/site images
- `assets/img/projects/web`: web project screenshots
- `assets/img/projects/design`: design project screenshots
- `assets/img/projects/automation`: automation project screenshots
- `assets/pdf`: resume files

## Contact form setup for Vercel

The contact form posts to `/api/contact` and sends messages to `jerem.quiambao@gmail.com`.

### Required environment variables

Set these in your Vercel project settings:

- `RESEND_API_KEY`: your Resend API key
- `CONTACT_TO_EMAIL`: `jerem.quiambao@gmail.com`
- `CONTACT_FROM_EMAIL`: a verified sender email from your domain, such as `hello@yourdomain.com`

### Important note

The form will not send real messages until `CONTACT_FROM_EMAIL` is a verified sender in Resend. If that sender is missing or not verified, the frontend will show a readable error instead of failing silently.

## Local editing notes

- Keep `index.html` at the project root and place non-homepage case-study pages in the grouped `projects/` folders.
- When adding a new case-study page, update homepage project links and use `../../` paths inside the nested HTML file for shared assets and homepage section links.
- Put new project screenshots in the matching folder under `assets/img/projects/`.
- Shared site graphics like the logo, favicon, and profile images stay in `assets/img/`.
