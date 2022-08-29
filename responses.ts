// Returns a redirect response to the specified url with a default status of 302.
export function redirect(location: string, options: ResponseInit = {}) {
  return new Response(`Redirecting you to ${location}...`, {
    status: 302,
    ...options,
    headers: {
      ...options.headers,
      location,
    },
  });
}
