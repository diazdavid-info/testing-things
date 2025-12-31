import { fileURLToPath } from 'url'
import { dirname } from 'node:path'
import { OAuth2Client } from 'google-auth-library'
import express from 'express'
import { engine } from 'express-handlebars'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', `${__dirname}/views`)

app.get('/', (req, res) => {
  res.render('home', { GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID })
})

app.post('/', async (req, res) => {
  const { credential } = req.body

  const client = new OAuth2Client()

  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: [process.env.GOOGLE_CLIENT_ID],
    })
    const { email, hd, sub, name, picture, given_name, family_name } = ticket.getPayload()

    return { email, hd, sub, name, picture, given_name, family_name }
  }

  try {
    const data = await verify()
    res.render('home', { NAME: data.given_name, SURNAME: data.family_name, EMAIL: data.email, PICTURE: data.picture })
    // res.send(`<h1>${data.given_name} ${data.family_name}</h1><h2>${data.email}</h2><img src="${data.picture}" />`)
    // res.json(data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/template', (req, res) => {
  res.render('home', { GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID })
})

app.listen(3001, () => {
  console.log('Listening on port 3001')
})
