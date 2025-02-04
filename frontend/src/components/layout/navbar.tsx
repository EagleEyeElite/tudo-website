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

interface MainNavbarProps {
  initialState: ActivityIndicatorState;
}

export default function MainNavbar({ initialState }: MainNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    {
      name: "About Us",
      links: [
        {text: "Who are we", href: "/about-us/who-are-we"},
        {text: "How to find us", href: "/about-us/how-to-find-us"},
        {text: "Opening Hours", href: "/about-us/opening-hours"},
        {text: "Contact Us", href: "/about-us/official-channels"},
        {text: "Support Us", href: "/about-us/support-us"},
      ]
    },
    {
      name: "Rooms",
      links: [
        {text: "Café", href: "/about-us/cafe"},
        {text: "Electronics Lab", href: "/about-us/electronics-lab"},
        {text: "Wood Workshop", href: "/about-us/wood-workshop"},
        {text: "Seminar Room", href: "/about-us/seminar-room"},
      ]
    },
    {
      name: "DIY Services",
      links: [
        {text: "3D Printing", href: "/about-us/3d-printing"},
        {text: "Screen Printing", href: "/events/screen-printing-workshop"},
        {text: "Machine Sewing", href: "/events/nahen-lernen-workshop"},
      ]
    },
  ];

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

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={`${item.name}-${index}`}>
            <Link
              href={item.links[0].href}
              className="text-lg hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end" className="gap-4">
        <NavbarItem>
          <div className="relative">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <div
              className="absolute inset-0 h-3 w-3 rounded-full bg-green-500 [animation:delayedPing_3s_infinite]"
            />
          </div>
          <style>{`@keyframes delayedPing{0%{transform:scale(1);opacity:.4}40%{transform:scale(2);opacity:0}41%,to{transform:scale(1);opacity:0}}`}</style>
        </NavbarItem>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
      </NavbarContent>

      <NavbarMenu className="bg-white/70 backdrop-blur-md backdrop-saturate-150">
        <div className="flex justify-end">
          <ActivityIndicator initialData={initialState} />
        </div>
        {menuItems.map((item, index) => (
          <div key={`${item.name}-${index}`} className="mt-6">
            <div className="font-semibold text-xl mb-2">{item.name}</div>
            {item.links.map((link, linkIndex) => (
              <NavbarMenuItem key={`${link.text}-${linkIndex}`} className="mb-1">
                <Link
                  href={link.href}
                  className="w-full py-2 text-lg hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.text}
                </Link>
              </NavbarMenuItem>
            ))}
          </div>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
