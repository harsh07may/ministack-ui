import ServiceGrid from "../components/ServiceGrid";

export default function HomePage() {
  return (
    <main className="p-8">
      <h1 className="text-lg font-semibold text-zinc-100 mb-6">
        Resource Browser
      </h1>
      <ServiceGrid />
    </main>
  );
}
