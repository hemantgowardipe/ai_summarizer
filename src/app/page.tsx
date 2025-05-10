import SummaryForm from "@/components/SummaryForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl text-black font-bold text-center mb-6">AI Text Summarizer</h1>
        <SummaryForm />
      </div>
    </main>
  );
}
