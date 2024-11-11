import { WorkflowEntrypoint, WorkflowEvent, WorkflowStep } from 'cloudflare:workers';
import puppeteer from '@cloudflare/puppeteer';

type Link = {
	title: string;
	href: string;
	slug: string;
};

export class TestWorkflow extends WorkflowEntrypoint<Env, Params> {
	async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
		const {links} = JSON.parse(`{"links": [{"title":"AI Gateway","slug":"ai-gateway","href":"https://developers.cloudflare.com/ai-gateway/"},{"title":"Browser Rendering","slug":"browser-rendering","href":"https://developers.cloudflare.com/browser-rendering/"},{"title":"Calls","slug":"calls","href":"https://developers.cloudflare.com/calls/"},{"title":"Cloudflare for Platforms","slug":"cloudflare-for-platforms","href":"https://developers.cloudflare.com/cloudflare-for-platforms/"},{"title":"D1","slug":"d1","href":"https://developers.cloudflare.com/d1/"},{"title":"Data Localization Suite","slug":"data-localization-suite","href":"https://developers.cloudflare.com/data-localization/"},{"title":"Developer Spotlight","slug":"developer-spotlight","href":"https://developers.cloudflare.com/developer-spotlight/"},{"title":"Durable Objects","slug":"durable-objects","href":"https://developers.cloudflare.com/durable-objects/"},{"title":"Email Routing","slug":"email-routing","href":"https://developers.cloudflare.com/email-routing/"},{"title":"Hyperdrive","slug":"hyperdrive","href":"https://developers.cloudflare.com/hyperdrive/"},{"title":"Cloudflare Images","slug":"cloudflare-images","href":"https://developers.cloudflare.com/images/"},{"title":"KV","slug":"kv","href":"https://developers.cloudflare.com/kv/"},{"title":"Pages","slug":"pages","href":"https://developers.cloudflare.com/pages/"},{"title":"Privacy Gateway","slug":"privacy-gateway","href":"https://developers.cloudflare.com/privacy-gateway/"},{"title":"Pub/Sub","slug":"pub/sub","href":"https://developers.cloudflare.com/pub-sub/"},{"title":"Pulumi","slug":"pulumi","href":"https://developers.cloudflare.com/pulumi/"},{"title":"Queues","slug":"queues","href":"https://developers.cloudflare.com/queues/"},{"title":"R2","slug":"r2","href":"https://developers.cloudflare.com/r2/"},{"title":"Stream","slug":"stream","href":"https://developers.cloudflare.com/stream/"},{"title":"Tenant","slug":"tenant","href":"https://developers.cloudflare.com/tenant/"},{"title":"TURN Service","slug":"turn-service","href":"https://developers.cloudflare.com/calls/turn/"},{"title":"Turnstile","slug":"turnstile","href":"https://developers.cloudflare.com/turnstile/"},{"title":"Vectorize","slug":"vectorize","href":"https://developers.cloudflare.com/vectorize/"},{"title":"Waiting Room","slug":"waiting-room","href":"https://developers.cloudflare.com/waiting-room/"},{"title":"Cloudflare Web Analytics","slug":"cloudflare-web-analytics","href":"https://developers.cloudflare.com/web-analytics/"},{"title":"Workers AI","slug":"workers-ai","href":"https://developers.cloudflare.com/workers-ai/"},{"title":"Workers Analytics Engine","slug":"workers-analytics-engine","href":"https://developers.cloudflare.com/analytics/analytics-engine/"},{"title":"Workers for Platforms","slug":"workers-for-platforms","href":"https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/"},{"title":"Workers","slug":"workers","href":"https://developers.cloudflare.com/workers/"},{"title":"Workflows","slug":"workflows","href":"https://developers.cloudflare.com/workflows/"},{"title":"Zaraz","slug":"zaraz","href":"https://developers.cloudflare.com/zaraz/"}]}`);
		for (const link of links) {
			const slogan = `This is an example slogan for ${link.title}`;
			const inserted = await step.do(`Storing ${link.title} in database`, async () => {
				let slug = link.slug;
				console.log(`Inserting ${slug}: ${link.title}`);
				const result = await this.env.DB.prepare(`INSERT INTO temp_flash_cards (slug, title, description, url) VALUES (?, ?, ?, ?);`)
					.bind(slug, link.title, slogan, link.href)
					.run();
				return true;
			});
			const embeddings = await step.do(`Creating embeddings for ${link.title}`, async() => {
				const results = await this.env.AI.run("@cf/baai/bge-large-en-v1.5", {
					text: slogan
				});
				return results.data[0];
			});
			const indexed = await step.do(`Indexing ${link.title}`, async() => {
				const results = await this.env.VECTORIZE.upsert([
					{
						id: link.slug,
						values: embeddings,
						metadata: {
							text: slogan,
							url: link.href
						}
					}
				]);
				return results;
			});
		}
	}
}
