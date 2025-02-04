'use client'

import React from "react";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import TuDoLogo from "@public/assets/tudo-logo.svg";
import { type ActivityIndicatorState } from "@/lib/api/activityIndicator";
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
        { text: "Who are we", href: "/about-us/who-are-we" },
        { text: "How to find us", href: "/about-us/how-to-find-us" },
        { text: "Opening Hours", href: "/about-us/opening-hours" },
        { text: "Contact Us", href: "/about-us/official-channels" },
        { text: "Support Us", href: "/about-us/support-us" },
      ]
    },
    {
      name: "Rooms",
      links: [
        { text: "Café", href: "/about-us/cafe" },
        { text: "Electronics Lab", href: "/about-us/electronics-lab" },
        { text: "Wood Workshop", href: "/about-us/wood-workshop" },
        { text: "Seminar Room", href: "/about-us/seminar-room" },
      ]
    },
    {
      name: "DIY Services",
      links: [
        { text: "3D Printing", href: "/about-us/3d-printing" },
        { text: "Screen Printing", href: "/events/screen-printing-workshop" },
        { text: "Machine Sewing", href: "/events/nahen-lernen-workshop" },
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

      {/* Desktop Navigation with Dropdowns - Only visible on large screens */}
      <NavbarContent className="hidden lg:flex gap-4" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={`${item.name}-${index}`}>
            <Dropdown>
              <DropdownTrigger>
                <button className="text-lg hover:text-primary transition-colors">
                  {item.name}
                </button>
              </DropdownTrigger>
              <DropdownMenu aria-label={`${item.name} navigation`}>
                {item.links.map((link, linkIndex) => (
                  <DropdownItem key={`${link.text}-${linkIndex}`}>
                    <Link
                      href={link.href}
                      className="w-full text-lg hover:text-primary transition-colors"
                    >
                      {link.text}
                    </Link>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Right side content */}
      <NavbarContent justify="end" className="gap-4">
        {/* Activity Indicator - Hidden on small screens */}
        <NavbarItem className="hidden md:flex">
          <ActivityIndicator initialData={initialState} />
        </NavbarItem>

        {/* Green Ping - Only visible on small screens when menu is closed */}
        <NavbarItem className={`md:hidden ${isMenuOpen ? 'hidden' : 'block'}`}>
          <div className="relative">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <div className="absolute inset-0 h-3 w-3 rounded-full bg-green-500 [animation:delayedPing_3s_infinite]" />
          </div>
          <style>{`@keyframes delayedPing{0%{transform:scale(1);opacity:.4}40%{transform:scale(2);opacity:0}41%,to{transform:scale(1);opacity:0}}`}</style>
        </NavbarItem>

        {/* Burger Menu Toggle - Visible on all screens except large */}
        <NavbarMenuToggle
          className="lg:hidden"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="bg-white/70 backdrop-blur-md backdrop-saturate-150">
        {/* Only show ActivityIndicator in menu for small screens */}
        <div className="flex justify-end md:hidden">
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
