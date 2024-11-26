import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="px-6 py-3 text-white bg-indigo-600 rounded hover:bg-indigo-700">
          
            Go Back Home
          
        </Link>
      </div>
    </div>
  );
}
