module.exports = ({ redis }) => [
  'post',
  [
    '/token',
    async (req, res) => {
      try {
        const code = req.body.code;
        if (!code) {
          throw new Error('missing code');
        }
        let tokens = await redis.getJSON(`TOKENS:${code}`);
        if (!tokens) {
          throw new Error('incorrect code');
        }
        res.status(200).send(tokens);
      } catch (e) {
        res.status(403).send();
      }
    },
  ],
];
