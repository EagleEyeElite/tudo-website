import Container from './container'
import Image from 'next/image';
import TuDoLogo from '../public/assets/tudo-logo.svg'
import React from "react";
import {Links} from "./links";

function Logo() {
  return <div className="flex flex-col xl:flex-row items-center">
    <Image src={TuDoLogo} alt="TuDo" className={"w-[200px]"}/>
    <h3
      className="text-4xl lg:text-5xl font-bold tracking-tighter leading-tight text-center xl:text-left mb-0 mt-3 xl:my-5 xl:mx-0 ml-0 xl:ml-5 xl:pr-4 xl:w-1/2">
      Makerspace
    </h3>
  </div>
}


export default function Footer() {
  return (
    <footer className="bg-accent-1 border-t border-accent-2">
      <Container>
        <div className="py-28 flex flex-col lg:flex-row justify-between">
          <Logo/>
          <Links links = {[
            {text: "Impressum", href: "https://tu-do.net/impressum"},
            {text: "Wegbeschreibung", href: "https://tu-do.net/wie-man-uns-findet"},
            {text: "Projekte", href: "https://github.com/TU-DO-Makerspace"},
            {text: "Events"},
            {text: "Öffnungszeiten", href: "https://t.me/+MW8nzEwFLuFiOGE0", highlighted: true},
          ]}/>
        </div>
      </Container>
    </footer>
  )
}
