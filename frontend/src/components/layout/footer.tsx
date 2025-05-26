import Container from '@/components/ui/container'
import Image from 'next/image';
import TuDoLogo from '@public/assets/tudo-logo.svg'
import React from 'react';
import {Links} from '@/components/ui/links';
import Link from 'next/link';
import {
  ABOUT_US_PATH,
  HOW_TO_FIND_US_PATH,
  IMPRINT_PATH,
  OPENING_HOURS_PATH,
  PRIVACY_POLICY_PATH
} from '@/lib/constants';

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
    <footer className="bg-[#fafafa] border-t border-[#eaeaea]">
      <Container>
        <div className="py-28 flex flex-col lg:flex-row justify-between">
          <Logo/>
          <Links links = {[
            { text: "Impressum", href: IMPRINT_PATH },
            { text: "Datenschutz", href: PRIVACY_POLICY_PATH },
            { text: "Wegbeschreibung", href: HOW_TO_FIND_US_PATH },
            { text: "Über uns", href: ABOUT_US_PATH },
            { text: "Öffnungszeiten", href: OPENING_HOURS_PATH, highlighted: true },
          ]}/>
        </div>
      </Container>
    </footer>
  )
}
