import React from "react";
import Link from "next/link";

export default function MainNavigation(props) {
  console.log(props);

  return (
    <header className="flex justify-between bg-black p-6 shadow-md">
      <h1 className="text-white">ORION</h1>
      <div className="flex items-center">
        <span className="inline-block mr-6 text-white">
          {props.displayName}
        </span>
        <nav>
          <ul className="list-reset flex">
            <li>
              <Link href={props.loginUrl}>
                <a className="inline-block no-underline bg-green hover:bg-green-light text-white font-bold py-2 px-4 border-b-4 border-green-dark hover:border-green rounded uppercase">
                  Logout
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
