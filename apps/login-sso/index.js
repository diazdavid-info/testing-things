import express from 'express'
import { IdentityProvider, ServiceProvider } from 'saml2-js'
import path from 'path'
import { fileURLToPath } from 'url'
import { ConfidentialClientApplication } from '@azure/msal-node'
import session from 'express-session'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const { SAML_URL, PUBLIC_KEY, ASSERT_ENDPOINT, TENANT_ID, CLIENT_ID, CLIENT_SECRET } = process.env

const LOGIN_URL = 'https://login.microsoftonline.com/common/saml2'
const LOGOUT_URL = 'https://login.microsoftonline.com/common/saml2'

const app = express()
const port = 4001

app.use(
  session({
    secret: 'someSecretKey',
    resave: false,
    saveUninitialized: true,
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/init-login', async (req, res) => {
  const idpOptions = {
    sso_login_url: LOGIN_URL,
    sso_logout_url: LOGOUT_URL,
    certificates: [Buffer.from(PUBLIC_KEY, 'base64').toString()],
    allow_unencrypted_assertion: true,
  }
  const idp = new IdentityProvider(idpOptions)

  const spOptions = {
    entity_id: `${SAML_URL}`,
    private_key: '',
    certificate: Buffer.from(PUBLIC_KEY, 'base64').toString(),
    assert_endpoint: ASSERT_ENDPOINT,
    allow_unencrypted_assertion: true,
  }
  const sp = new ServiceProvider(spOptions)

  sp.create_login_request_url(idp, { relay_state: app }, function (err, loginUrl) {
    if (err) return res.json({ error: err }).status(500)
    return res.redirect(loginUrl)
  })
})

app.post('/callback', async (req, res) => {
  const idpOptions = {
    sso_login_url: LOGIN_URL,
    sso_logout_url: LOGOUT_URL,
    certificates: [Buffer.from(PUBLIC_KEY, 'base64').toString()],
    allow_unencrypted_assertion: true,
  }
  const idp = new IdentityProvider(idpOptions)

  const spOptions = {
    entity_id: `${SAML_URL}`,
    private_key: '',
    certificate: Buffer.from(PUBLIC_KEY, 'base64').toString(),
    assert_endpoint: ASSERT_ENDPOINT,
    allow_unencrypted_assertion: true,
  }

  const sp = new ServiceProvider(spOptions)
  const options = {
    request_body: { ...req.body },
    require_session_index: false,
  }

  sp.post_assert(idp, options, async function (err, samlResponse) {
    if (err !== null) return res.send(err).status(500)
    req.session.user = { name: samlResponse.user.name_id, attributes: samlResponse.user.attributes }
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: `${SAML_URL}/delegate`,
      response_mode: 'query',
      scope: 'openid profile offline_access',
      state: 'oidc',
    })
    const authorizationUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize?${params.toString()}`
    return res.redirect(authorizationUrl)
  })
})

app.get('/delegate', async (req, res) => {
  const authCode = req.query.code
  const msalConfig = {
    auth: {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      authority: `https://login.microsoftonline.com/${TENANT_ID}`,
    },
  }
  const cca = new ConfidentialClientApplication(msalConfig)
  try {
    const tokenResponse = await cca.acquireTokenByCode({
      code: authCode,
      scopes: ['openid', 'profile', 'offline_access'],
      redirectUri: `${SAML_URL}/delegate`,
    })

    req.session.delegatedToken = tokenResponse.accessToken

    return res.json({
      message: 'Autenticación delegada completada',
      user: req.session.user,
      delegatedToken: tokenResponse.accessToken,
    })
  } catch (error) {
    console.error('Error al obtener token delegado OIDC:', error)
    return res.status(500).json({ error: error.toString() })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
