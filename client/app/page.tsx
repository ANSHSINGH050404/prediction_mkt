'use client'
import Image from "next/image";
import LoginPage from "./login/page";
import UserContext from "@/context/UserContext";
import { useContext } from "react";

export default function Home() {
  const { user } = useContext(UserContext) as { user?: { name: string } };
  return (
    <>
    <h1>Home Page</h1>
    {user ? <p>Welcome, {user.name}!</p> : <LoginPage />}
    </>
  );
}
