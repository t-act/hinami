export async function onRequest(context) {
  const url = new URL(context.request.url);
  const targetPath = url.pathname.replace(/^\/api/, "");
  const targetUrl = `https://hinami-api.hinami.workers.dev${targetPath}${url.search}`;

  return fetch(targetUrl, {
    method: context.request.method,
    headers: context.request.headers,
    body: context.request.body,
  });
}
