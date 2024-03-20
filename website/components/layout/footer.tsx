import Container from '../ui/container'
import Image from 'next/image';
import TuDoLogo from '../../public/assets/tudo-logo.svg'
import React from "react";
import {Links} from "../ui/links";
import {GITHUB_PATH, TELEGRAM_PATH} from "../../lib/constants";
import Link from "next/link";

function Logo() {
  return <Link href="/" className="flex flex-col xl:flex-row items-center">
    <Image src={TuDoLogo} alt="TuDo" className={"w-[200px]"}/>
    <h3
      className="text-4xl lg:text-5xl font-bold tracking-tighter leading-tight text-center xl:text-left mb-0 mt-3 xl:my-5 xl:mx-0 ml-0 xl:ml-5 xl:pr-4 xl:w-1/2">
      Makerspace
    </h3>
  </Link>
}


export default function Footer() {
  return (
    <footer className="bg-accent-1 border-t border-accent-2">
      <Container>
        <div className="py-28 flex flex-col lg:flex-row justify-between">
          <Logo/>
          <Links links = {[
            {text: "Impressum", href: "/pages/impressum"},
            {text: "Wegbeschreibung", href: "/pages/wegbeschreibung"},
            {text: "Projekte", href: GITHUB_PATH},
            {text: "Events"},
            {text: "Öffnungszeiten", href: TELEGRAM_PATH, highlighted: true},
          ]}/>
        </div>
      </Container>
    </footer>
  )
}
