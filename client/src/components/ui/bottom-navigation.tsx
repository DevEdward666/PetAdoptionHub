import { Link, useLocation } from "wouter";

export function BottomNavigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 py-2 px-4 z-10">
      <div className="flex justify-between">
        <Link href="/">
          <a className={`flex flex-col items-center w-1/4 py-1 ${location === "/" ? "text-primary" : "text-gray-500"}`}>
            <i className={`ri-home-${location === "/" ? "5-fill" : "line"} text-xl`}></i>
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        <Link href="/search">
          <a className={`flex flex-col items-center w-1/4 py-1 ${location === "/search" ? "text-primary" : "text-gray-500"}`}>
            <i className={`ri-search-${location === "/search" ? "fill" : "line"} text-xl`}></i>
            <span className="text-xs mt-1">Search</span>
          </a>
        </Link>
        <Link href="/favorites">
          <a className={`flex flex-col items-center w-1/4 py-1 ${location === "/favorites" ? "text-primary" : "text-gray-500"}`}>
            <i className={`ri-heart-${location === "/favorites" ? "fill" : "line"} text-xl`}></i>
            <span className="text-xs mt-1">Favorites</span>
          </a>
        </Link>
        <Link href="/profile">
          <a className={`flex flex-col items-center w-1/4 py-1 ${location === "/profile" ? "text-primary" : "text-gray-500"}`}>
            <i className={`ri-user-${location === "/profile" ? "fill" : "line"} text-xl`}></i>
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Link>
      </div>
    </nav>
  );
}
