"use client";
import React from "react";

import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import Link from "next/link";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();

  const user: User = session?.user as User

return (
  <div>
    <nav className="py-5 bg-black content-center ">
      <div className=" flex justify-around  content-center">
        <a  className = "font-mono  font-extrabold text-xl" href="#">Mystery Message</a>
        {session ? (
          <>
            <span>`Welcome ${user.username || user.email}`</span>
            <button onClick={() => signOut()}>Log Out </button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button variant="link" className=" curson-pointer animate-pulse font-mono text-m underline decoration-teal-300 decoration-2" >Log in</Button>
          </Link> 
        )}
      </div>
    </nav>
  </div>
);}

export default Navbar;
