import Link from "next/link";

export default function Nav() {
  return (
    <nav>
      <span className="navLogo">
        <img src="/logo.png" />
      </span>
      <span className="leftNav">
        <Link href="/">
          <a>Home</a>
        </Link>
        <Link href="/profile">
          <a>Profile</a>
        </Link>
      </span>
      <span className="rightNav">
        <Link href="/logout">
          <a>Logout</a>
        </Link>
      </span>
    </nav>
  );
}
