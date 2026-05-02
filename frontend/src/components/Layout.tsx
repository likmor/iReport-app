import { Outlet, NavLink } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>

      <main>
        <Outlet />
      </main>
    </>
  );
}
