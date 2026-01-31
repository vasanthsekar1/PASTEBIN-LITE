
# Pastebin-Lite

A minimal Pastebin-like app built with Next.js, TypeScript, and Upstash Redis. Create and share text pastes with optional expiry and view limits.

## Project Description
- Create a text paste and get a shareable link.
- Each paste can have an optional time-to-live (TTL) and/or max view count.
- When a constraint is reached, the paste becomes unavailable.
- Simple UI for creating and viewing pastes.

## How to Run Locally

1. **Clone the repo:**
	```sh
	git clone <your-repo-url>
	cd pastebin-lite
	```
2. **Install dependencies:**
	```sh
	npm install
	```
3. **Set Up Environment Variables:**
	Create a `.env.local` file with:
	```env
	UPSTASH_REDIS_REST_URL=your_upstash_redis_url
	UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
	# Optional for testing:
	TEST_MODE=1
	```
4. **Run the app:**
	```sh
	npm run dev
	```
5. **Open in browser:**
	Visit [http://localhost:3000](http://localhost:3000)

## Persistence Layer
This app uses **Upstash Redis** (serverless, Vercel-friendly) for storing pastes. Data persists across requests and deployments.

## Notable Design Decisions
- Stateless API routes for serverless compatibility.
- Deterministic expiry logic for testing (see `TEST_MODE` and `x-test-now-ms` header).
- All paste content is safely rendered (no script execution).

---

Replace `<your-repo-url>` with your repository URL before sharing.
