import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-sm font-semibold text-gold-500 uppercase tracking-[0.3em]">404</p>
      <h1 className="mt-4 text-4xl font-bold text-navy-900">Page not found</h1>
      <p className="mt-4 max-w-xl text-base text-slate-600">
        The page you are looking for does not exist or may have moved. Use the navigation to return to the site.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-800"
      >
        Back to home
      </Link>
    </main>
  );
}
