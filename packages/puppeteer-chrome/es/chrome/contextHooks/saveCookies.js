export async function saveCookies(userId, page) {
  const { cookies } = await page._client.send('Network.getAllCookies');

  if (cookies) {
    console.info(JSON.stringify(cookies.filter((cookie) => !cookie.session)));
  }
}
