import { Webhook } from 'svix'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Erreur: Veuillez ajouter SIGNING_SECRET du tableau de bord Clerk à .env ou .env.local')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Erreur : en-têtes Svix manquants', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt//: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    })// as WebhookEvent
  } catch (err) {
    console.error('Erreur : Impossible de vérifier le webhook:', err)
    return new Response('Erreur : erreur de vérification', {
      status: 400,
    })
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt.data
  const eventType = evt.type
  console.log(`Webhook reçu avec l'ID ${id} et le type d'événement ${eventType}`)
  console.log('Charge utile du webhook payload:', body)

  if (evt.type === 'user.created') {
    console.log('userId:', evt.data.id)
  }

  if (evt.type === 'user.updated') {
    console.log('user est mis à jour:', evt.data.id)
  }

  return new Response('Webhook reçu', { status: 200 })
}