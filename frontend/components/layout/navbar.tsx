import Container from "../ui/container";
import Image from "next/image";
import TuDoLogo from "../../public/assets/tudo-logo.svg";
import React from "react";
import Link from "next/link";
import {ActivityIndicatorState} from "lib/api/activityIndicator";
import OpenClosedIndicator from "./openClosedIndicator";

interface Props {
  activityIndicator: ActivityIndicatorState
}

export function Navbar({activityIndicator}: Props) {
  return <nav
    className="sticky top-0 z-10 bg-white backdrop-filter backdrop-blur-md backdrop-saturate-150 bg-opacity-70 border-b border-black border-opacity-10 overflow-hidden">
    <Container>
      <div className="flex items-center justify-between h-16">
        <Link href="/" className="flex items-center">
          <Image src={TuDoLogo} alt="TuDo" className={"h-10 w-fit"}/>
          <h2
            className="text-3xl font-bold tracking-tighter text-left ml-2 hidden sm:inline">
            Makerspace
          </h2>
        </Link>
        <OpenClosedIndicator activityIndicator={activityIndicator} />
      </div>
    </Container>
  </nav>;
}
