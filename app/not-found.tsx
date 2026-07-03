import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-app-bg px-4 text-center">
      <h1 className="text-6xl font-black text-app-text">404</h1>
      <p className="mt-4 text-lg text-app-muted">
        This page could not be found.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-[#1DB954] px-8 py-3 text-sm font-bold text-black hover:scale-105"
      >
        Go to Spotify Home
      </Link>
    </div>
  );
}
