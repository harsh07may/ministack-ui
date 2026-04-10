import ServiceCard from "./ServiceCard";

const SERVICES = [
  { service: "s3", label: "S3", noun: "Buckets", icon: "🪣" },
  { service: "sqs", label: "SQS", noun: "Queues", icon: "📬" },
  { service: "dynamodb", label: "DynamoDB", noun: "Tables", icon: "🗄️" },
  { service: "lambda", label: "Lambda", noun: "Functions", icon: "λ" },
  { service: "sns", label: "SNS", noun: "Topics", icon: "📣" },
  {
    service: "secretsmanager",
    label: "Secrets Manager",
    noun: "Secrets",
    icon: "🔐",
  },
] as const;

export default function ServiceGrid() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {SERVICES.map((s) => (
        <ServiceCard key={s.service} {...s} />
      ))}
    </div>
  );
}
