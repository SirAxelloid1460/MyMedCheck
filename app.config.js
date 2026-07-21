// Extiende app.json. Solo inyecta `experiments.baseUrl` cuando se define
// EXPO_BASE_URL (p. ej. en el despliegue a GitHub Pages, donde el sitio se
// sirve bajo /<nombre-del-repo>/). En local no se toca, así que `serve dist`
// y `expo start --web` siguen funcionando desde la raíz.
module.exports = ({ config }) => {
  const baseUrl = process.env.EXPO_BASE_URL;
  if (baseUrl) {
    config.experiments = { ...(config.experiments || {}), baseUrl };
  }
  return config;
};
