import React from "react";
const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Contact", href: "#contact" },
];

function Navbar() {
  const navLinkStyling =
    "text-blue-500 bg-yellow-200 p-3 px-10 text-2xl hover:bg-red-300";
  return (
    <>
      <nav className="p-10">
        <ul className="flex flex-col space-y-14 ">
          {navLinks.map(({ name, href = "" }) => (
            <li key={name}>
              <a href={href} className={navLinkStyling}>
                {name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
