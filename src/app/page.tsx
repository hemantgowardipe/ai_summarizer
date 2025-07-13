import SummaryForm from "@/components/SummaryForm";

export default function Home() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl p-6">
        <SummaryForm />
      </div>
    </main>
  );
}
