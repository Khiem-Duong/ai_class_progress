const { Redis } = require('@upstash/redis')

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const items = await redis.get('items') || []
      return res.json(items)
    }

    if (req.method === 'POST') {
      const items = await redis.get('items') || []
      const item = { id: Date.now(), text: req.body.text }
      items.push(item)
      await redis.set('items', items)
      return res.json(item)
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      const items = (await redis.get('items') || []).filter(i => String(i.id) !== id)
      await redis.set('items', items)
      return res.json({ ok: true })
    }

    res.status(405).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
