/**
 * Add this Action to Auth0 → Actions → Flows → Login.
 * It exposes the app_metadata.role value as a namespaced ID-token claim.
 */
exports.onExecutePostLogin = async (event, api) => {
  const namespace = event.secrets.ROLE_CLAIM_NAMESPACE || 'https://dadgar.example.com';
  const role = event.user.app_metadata?.role || 'client';
  api.idToken.setCustomClaim(`${namespace}/role`, role);
};
