import {
  Actor,
  Puppeteer,
  createPuppeteerCDPSession,
  log,
} from "@scrapeless-ai/sdk";

interface ActorInput {
  email: string;
  password: string;
}

const Log = log.withPrefix("Scrapeless Actor");

async function main() {
  const actor = new Actor();
  const { email, password } = await actor.input<ActorInput>();
  const browser = await Puppeteer.connect({
    session_name: "scrapeless",
    session_ttl: 180,
    proxy_country: "ANY",
    session_recording: true,
  });
  const page = await browser.newPage();
  await page.goto("https://prenotami.esteri.it/", { timeout: 60000 });

  const session = await createPuppeteerCDPSession(page);

  await session.realFill("#login-email", email);
  await session.realFill("#login-password", password);

  const { message } = await session.waitCaptchaSolved();
  Log.info("Captcha solved", message);

  await browser.disconnect();
}

main().catch((error) => {
  Log.error("Error:", error);
  process.exit(1);
});
