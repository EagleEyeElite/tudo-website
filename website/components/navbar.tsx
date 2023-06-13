import Container from "./container";
import Image from "next/image";
import TuDoLogo from "../public/assets/tudo-logo.svg";
import {Links} from "./links";
import React from "react";

export function Navbar() {
    return <nav className="sticky top-0 z-10 bg-white backdrop-filter backdrop-blur-md backdrop-saturate-150 bg-opacity-70 border-b border-black border-opacity-10">
        <Container>
            <div className="flex items-center justify-between h-16">
                <a href="/" className="flex items-center">
                    <Image src={TuDoLogo} alt="TuDo" className={"h-10 w-fit"}/>
                    <h2
                        className="text-3xl font-bold tracking-tighter text-left ml-2">
                        Makerspace
                    </h2>
                </a>
                <div className="hidden lg:block">
                    <Links links = {[
                        {text: "Wegbeschreibung", href: "https://tu-do.net/wie-man-uns-findet"},
                        {text: "Öffnungszeiten", href: "https://t.me/+MW8nzEwFLuFiOGE0", highlighted: true},
                    ]}/>
                </div>
            </div>
        </Container>
    </nav>;
}
