import Link from "next/link";
import Router from "next/router";

let logout = (event) => {
  event.preventDefault();
  delete localStorage.token;
  Router.reload();
};

export default function Nav() {
  return (
    <nav>
      <div className="nav-wrap">
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
          <a onClick={logout}>Logout</a>
        </span>
      </div>
    </nav>
  );
}
