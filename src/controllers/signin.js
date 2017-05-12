const path = require('path');
const shortid = require('shortid');

module.exports = ({ maxdome, redis }) => [
  ['get', ['/signin', async (req, res) => {
    res.sendFile('signin.html', { root: path.join(process.cwd(), 'www') });
  }]],
  ['post', ['/signin', require('body-parser').urlencoded({ extended: false }), async (req, res) => {
    try {
      const data = await maxdome.post('v1/auth/login', {
        body: {
          userId: req.body.email,
          phrase: req.body.password,
          autoLogin: true,
        },
      });
      const accessToken = shortid.generate();
      const linkedAccount = {
        autoLoginPin: data.autoLoginPin,
        customer: { customerId: data.customer.customerId },
        sessionId: data.sessionId,
      };
      await redis.setJSON(accessToken, linkedAccount);
      res.status(200).send({ accessToken });
    } catch (e) {
      res.status(403).send(e.message);
    }
  }]],
];
