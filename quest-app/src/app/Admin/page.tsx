// app/blog/page.tsx
import Header from '@/components/Header'; // Adjust path if necessary

export default function Blog() {
  return (
    <div className="min-h-screen bg-[#0A3E45] text-white font-sans">
      {/* Header Component */}
      <Header />
      
      <div className="p-6">
        <h1 className="text-3xl font-bold">Blog Page</h1>
        <p className="mt-4">This is the Blog page of the site.</p>
      </div>
    </div>
  );
}
