import { Hono } from 'hono';
import { ProductGathererWorkflow } from './product-gatherer';

export { ProductGathererWorkflow };

const app = new Hono<{ Bindings: Env }>();

// TODO: /api/cards from D1

// TODO: /api/cards/SLUG/svg from KV

// TODO: /api/cards/search?q= from Vectorize

export default app;
