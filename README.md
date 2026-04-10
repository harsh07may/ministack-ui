<p align="center">
  <img src="https://raw.githubusercontent.com/Nahuel990/ministack/master/ministack_logo.png" alt="MiniStack UI" width="360"/>
</p>

<h1 align="center">MiniStack UI</h1>
<p align="center"><strong>A developer dashboard for <a href="https://github.com/Nahuel990/ministack">MiniStack</a> — the free, open-source local AWS emulator.</strong></p>

<p align="center">
  <a href="https://github.com/Nahuel990/ministack"><img src="https://img.shields.io/badge/MiniStack%20CLI-GitHub-blue" alt="MiniStack CLI"></a>
  <img src="https://img.shields.io/badge/Next.js-16-black" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6" alt="TypeScript">
  <img src="https://img.shields.io/github/license/Nahuel990/ministack" alt="License">
</p>

---

## What is MiniStack UI?

MiniStack UI is a web-based control panel for inspecting and managing resources running inside a local [MiniStack](https://github.com/Nahuel990/ministack) instance. Instead of scripting AWS CLI commands or writing boto3 snippets to inspect your local environment, you get a live dashboard that connects to MiniStack's API on `localhost:4566`.

Think of it as a lightweight, local-only AWS Console — built for developer speed, not production management.

---

## Features

- **Live health dashboard** — real-time status of all 38+ emulated services with request/error counters
- **Resource browser** — list and inspect resources across S3, SQS, SNS, DynamoDB, Lambda, ECS, RDS, and more
- **S3 object explorer** — browse bucket contents, navigate prefixes (folder-style), and inspect object metadata
- **Per-service resource detail pages** — deep-dive into individual resources (functions, queues, tables, instances)
- **Create & delete resources** — CRUD actions for every major service, right from the browser
- **Multi-account aware** — toggle the active AWS account ID to inspect isolated tenants
- **Zero config** — points to `http://localhost:4566` by default; no authentication required

---

## Prerequisites

You need a running MiniStack instance. Start one with:

```bash
# Docker (recommended)
docker run -p 4566:4566 nahuelnucera/ministack

# or PyPI
pip install ministack
ministack
```

Verify it's up:
```bash
curl http://localhost:4566/_ministack/health
```

---

## Getting Started

### Development

```bash
# 1. Clone the repo
git clone https://github.com/Nahuel990/ministack-ui
cd ministack-ui

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll see the dashboard connected to whatever MiniStack is running on `localhost:4566`.

### Production build

```bash
npm run build
npm start
```

---

## Configuration

The UI reads MiniStack's endpoint from the environment. Create a `.env.local` file to override defaults:

```env
# MiniStack API endpoint (default: http://localhost:4566)
NEXT_PUBLIC_MINISTACK_URL=http://localhost:4566
```

No other configuration is required — the UI discovers service health and resource state dynamically from the MiniStack health endpoint.

---

## Project Structure

```
ministack-ui/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── page.tsx          # Dashboard home (health overview)
│   │   └── resources/
│   │       └── [service]/    # Per-service resource list pages
│   ├── components/           # Shared UI components
│   ├── contexts/             # React context providers
│   ├── hooks/                # Custom React hooks
│   └── lib/
│       ├── api.ts            # MiniStack API client
│       └── service-config.ts # Service metadata & AWS endpoint config
├── public/                   # Static assets
├── next.config.ts
├── biome.json                # Linting & formatting config
└── package.json
```

---

## Supported Services

The UI can browse resources across all services exposed by MiniStack:

| Category | Services |
|---|---|
| **Storage** | S3, DynamoDB, ElastiCache |
| **Compute** | Lambda, ECS, EC2 |
| **Messaging** | SQS, SNS, Kinesis, EventBridge, Firehose |
| **Database** | RDS |
| **Security** | IAM, Cognito, KMS, Secrets Manager, ACM |
| **Networking** | VPC/EC2, ALB, CloudFront, Route53, API Gateway |
| **DevOps** | CloudFormation, ECR, Glue, Step Functions |
| **Observability** | CloudWatch, CloudWatch Logs |

---

## Development Scripts

```bash
npm run dev      # Start development server (hot reload)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Lint with Biome
npm run format   # Format with Biome
```

---

## Architecture

MiniStack UI connects to MiniStack's internal API endpoints at runtime — no build-time coupling to any specific MiniStack version:

```
Browser (localhost:3000)
   │
   ├── GET /_ministack/health      → service health & request stats
   ├── GET /s3?Action=ListBuckets  → list S3 buckets
   ├── GET /sqs?Action=ListQueues  → list SQS queues
   └── ...all standard AWS API calls forwarded to localhost:4566
```

The app follows Next.js App Router conventions with server components for data fetching and client components for interactivity. AWS service calls are made directly from the browser to `localhost:4566` using the standard AWS REST/JSON/XML wire protocols — no backend proxy needed.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feat/my-feature`
5. Open a Pull Request

Please run `npm run lint` before submitting.

---

## Related

- [MiniStack CLI](https://github.com/Nahuel990/ministack) — the AWS emulator backend
- [MiniStack on Docker Hub](https://hub.docker.com/r/nahuelnucera/ministack)
- [MiniStack Website](https://ministack.org)

---

## License

MIT © [MiniStack Contributors](https://github.com/Nahuel990/ministack/blob/master/LICENSE)
