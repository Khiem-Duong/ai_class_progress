import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const sessions = await redis.get('sessions') || []
      return res.json(sessions)
    }

    if (req.method === 'POST') {
      const sessions = await redis.get('sessions') || []
      const session = { id: Date.now(), date: req.body.date, hours: req.body.hours }
      sessions.push(session)
      await redis.set('sessions', sessions)
      return res.json(session)
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      const sessions = (await redis.get('sessions') || []).filter(s => String(s.id) !== id)
      await redis.set('sessions', sessions)
      return res.json({ ok: true })
    }

    if (req.method === 'PATCH') {
      const { id } = req.query
      const sessions = await redis.get('sessions') || []
      const s = sessions.find(s => String(s.id) === id)
      if (s) s.hours = req.body.hours
      await redis.set('sessions', sessions)
      return res.json({ ok: true })
    }

    res.status(405).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
