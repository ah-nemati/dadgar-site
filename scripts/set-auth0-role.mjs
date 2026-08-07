import { loadEnvFile } from 'node:process';
try { loadEnvFile('.env.local'); } catch (error) { if (error?.code !== 'ENOENT') throw error; }
const [emailArg, roleArg = 'admin'] = process.argv.slice(2);
if (!emailArg || !['admin', 'client'].includes(roleArg)) {
  throw new Error('Usage: node scripts/set-auth0-role.mjs user@example.com admin');
}
const domain = process.env.AUTH0_DOMAIN?.replace(/^https?:\/\//, '').replace(/\/$/, '');
const clientId = process.env.AUTH0_M2M_CLIENT_ID;
const clientSecret = process.env.AUTH0_M2M_CLIENT_SECRET;
if (!domain || !clientId || !clientSecret) throw new Error('Auth0 M2M variables are required.');

const tokenResponse = await fetch(`https://${domain}/oauth/token`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    audience: `https://${domain}/api/v2/`,
  }),
});
if (!tokenResponse.ok) throw new Error(await tokenResponse.text());
const { access_token: token } = await tokenResponse.json();

const searchResponse = await fetch(
  `https://${domain}/api/v2/users-by-email?email=${encodeURIComponent(emailArg.toLowerCase())}`,
  { headers: { authorization: `Bearer ${token}` } }
);
if (!searchResponse.ok) throw new Error(await searchResponse.text());
const users = await searchResponse.json();
if (!users[0]?.user_id) throw new Error('User not found in Auth0.');

const updateResponse = await fetch(`https://${domain}/api/v2/users/${encodeURIComponent(users[0].user_id)}`, {
  method: 'PATCH',
  headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
  body: JSON.stringify({ app_metadata: { ...(users[0].app_metadata || {}), role: roleArg } }),
});
if (!updateResponse.ok) throw new Error(await updateResponse.text());
console.log(`Role ${roleArg} assigned to ${emailArg}. The user should sign out and sign in again.`);
