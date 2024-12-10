import { Webhook } from 'svix'
import { headers } from 'next/headers'
import {createOrUpdateUser, deleteUser} from '../../../lib/actions/user';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Erreur: Veuillez ajouter SIGNING_SECRET du tableau de bord Clerk à .env ou .env.local')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(WEBHOOK_SECRET)

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
  const { id } = evt?.data
  const eventType = evt?.type
  console.log(`Webhook reçu avec l'ID ${id} et le type d'événement ${eventType}`)
  console.log('Charge utile du webhook payload:', body)

  if(eventType === 'user.created' || eventType === 'user.updated'){
    const {
      id,
      first_name,
      last_name,
      image_url,
      email_addresses,
      username,
    } = evt?.data;

    try{
      const user = await createOrUpdateUser(
        id,
        first_name,
        last_name,
        image_url,
        email_addresses,
        username,
      );

      if(user && eventType === 'user.created'){
        try{
          const response = await clerkClient();
          await response.users.updateUserMetadata(id, {
            publicMetadata: {
              userMongoId: user._id,
              isAdmin: user.isAdmin
            }
          });
        }catch(error){
          console.log('Error de mis à jour user metadata', error);
        }
      }
    }catch(error){
        console.log('Error création ou de mis à jour user:', error);
        return new Response('Erreur', {status: 400});
    }
  }

  if(eventType === 'user.deleted'){
    const { id } = evt?.data;
    try{
      await deleteUser(id);
    }catch(error){
      console.log('Error création ou de mis à jour user:', error);
      return new Response('Erreur', {status: 400});
  }
  }
  return new Response('', { status: 200 })
}