/**
 * Auth0 Dashboard → Actions → Flows → Login
 *
 * Add a Secret named ROLE_CLAIM_NAMESPACE with this value:
 * https://majidsavarivakil.ir
 */
exports.onExecutePostLogin = async (event, api) => {
  const namespace = String(
    event.secrets.ROLE_CLAIM_NAMESPACE || 'https://majidsavarivakil.ir',
  ).replace(/\/$/, '');

  // Only the two application roles are allowed into the token.
  const role = event.user.app_metadata?.role === 'admin' ? 'admin' : 'client';

  api.idToken.setCustomClaim(`${namespace}/role`, role);
};
