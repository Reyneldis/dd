import Link from 'next/link';

export default function Logo() {
  return (
    <div>
      <Link
        className="text-2xl cursor-pointer font-semibold flex items-center gap-2 relative"
        href="/"
      >
        <h2 className="text-2xl font-bold text-gray-500/80">
          <span className="text-orange-400">Delivery</span> Express
        </h2>
      </Link>
    </div>
  );
}
