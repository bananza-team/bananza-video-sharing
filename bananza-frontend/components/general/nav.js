import Link from "next/link";

export default function Nav(){
return (
<nav>
  <span className="leftNav">
    <Link href="/">
      <a>Home</a>
    </Link>
    <Link href="/profile">
      <a>Profile</a>
    </Link>
  </span>
  <span className="rightNav">
    <Link href="/channel">
      <a>Channel</a>
    </Link>
    <Link href="/logout">
      <a>Logout</a>
    </Link>
  </span>
</nav>);
}
