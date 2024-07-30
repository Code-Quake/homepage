const server = Bun.serve({
  fetch: (request) => new Response(server.js),
  tls: {
    cert: Bun.file("cert.pem"),
    key: Bun.file("key.pem"),
  },
});
