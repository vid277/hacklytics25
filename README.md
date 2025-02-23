# DeQo - Decentralized Queue Orchestrator

![DeQo Banner](https://deqo.netlify.app/banner.png)

DeQo is a decentralized compute platform that allows users to share and monetize their idle computing resources. Built at Hacklytics 2024, DeQo aims to create an efficient marketplace for distributed computing.

## 🌟 Features

- **Resource Sharing**: Lend your idle compute resources (CPU/GPU) to earn rewards
- **Job Scheduling**: Submit compute jobs to be processed on the decentralized network
- **Secure Execution**: Docker-based containerization ensures safe and isolated job execution
- **Real-time Monitoring**: Track job status and resource utilization through an intuitive dashboard
- **Automated Payments**: Built-in payment system handles compensation for resource providers

## 🛠️ Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python
- **Database**: Supabase
- **Container Registry**: Amazon ECR
- **Storage**: Amazon S3
- **Authentication**: Supabase Auth

## 🚀 Getting Started

1. Visit [deqo.netlify.app](https://deqo.netlify.app)
2. Sign up as either a resource provider or job submitter
3. Resource providers: Configure availability schedule and resource specs
4. Job submitters: Package your compute job as a Docker container and submit

## 💡 How it Works

1. Users submit Docker containers containing their compute jobs
2. DeQo matches jobs with available compute resources based on requirements
3. Resource providers execute jobs in secure containers
4. Results are stored in S3 and made available to job submitters
5. Providers are compensated based on compute time and resource usage

## 🔒 Security

- Docker containers provide isolation between jobs
- Cryptographic verification ensures job integrity
- Secure authentication via Supabase
- HTTPS encryption for all API communication

## 👥 Team

- [Team Member 1] - Frontend Development
- [Team Member 2] - Backend Architecture  
- [Team Member 3] - DevOps & Infrastructure
- [Team Member 4] - Smart Contract Development

## 🏆 Hacklytics 2024

Built during Hacklytics 2024 at Georgia Tech. DeQo aims to democratize access to compute resources while providing an opportunity for resource providers to monetize idle capacity.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
