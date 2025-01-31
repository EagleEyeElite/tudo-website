'use client'

import React from "react";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import TuDoLogo from "@public/assets/tudo-logo.svg";
import {type ActivityIndicatorState} from "@/lib/api/activityIndicator";
import ActivityIndicator from "@/components/layout/openClosedIndicator";
import HeroLinks from "@/components/ui/hero-links";

interface MainNavbarProps {
  initialState: ActivityIndicatorState;
}

export default function MainNavbar({ initialState }: MainNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="sticky top-0 bg-white/70 border-b border-black/10 backdrop-blur-md backdrop-saturate-150 z-50"
      maxWidth="full"
      height="4rem"
      isBlurred
    >
      <NavbarContent>
        <Link href="/" className="flex items-center" onClick={() => isMenuOpen && setIsMenuOpen(false)}>
          <Image src={TuDoLogo} alt="TuDo" className="h-10 w-fit" />
          <h2 className="text-3xl font-bold tracking-tighter text-left pl-4">
            Makerspace
          </h2>
        </Link>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarMenu className="bg-white/70 backdrop-blur-md backdrop-saturate-150">
        <div className="flex justify-end">
          <ActivityIndicator initialData={initialState} />
        </div>
        <NavbarMenuItem className="mt-4">
          <HeroLinks />
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
