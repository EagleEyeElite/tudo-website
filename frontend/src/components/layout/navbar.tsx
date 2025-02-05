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
import { motion, AnimatePresence } from "framer-motion";

interface MainNavbarProps {
  initialState: ActivityIndicatorState;
  onMenuOpenChange: (isOpen: boolean) => void;
}

export default function MainNavbar({ initialState, onMenuOpenChange }: MainNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleMenuChange = (open: boolean) => {
    setIsMenuOpen(open);
    onMenuOpenChange(open);
  };

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
    <>
      {/* Fixed navbar blur - always visible */}
      <div
        className="fixed inset-x-0 top-0 h-16 bg-white/70 backdrop-blur-md backdrop-saturate-150"
        style={{ zIndex: 48 }}
      />

      {/* Animated full viewport blur for menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-white/70 backdrop-blur-md backdrop-saturate-150"
            style={{ zIndex: 48 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.2,
              ease: "easeInOut"
            }}
          />
        )}
      </AnimatePresence>

      <div className="sticky top-0 z-50">
        {/* Main Content */}
        <Navbar
          isMenuOpen={isMenuOpen}
          onMenuOpenChange={handleMenuChange}
          className="bg-transparent"
          maxWidth="full"
          height="4rem"
          isBlurred={false}
        >
          <NavbarContent>
            <Link href="/" className="flex items-center" onClick={() => isMenuOpen && handleMenuChange(false)}>
              <Image src={TuDoLogo} alt="TuDo" className="h-10 w-fit" />
              <h2 className="text-3xl font-bold tracking-tighter text-left pl-4">
                Makerspace
              </h2>
            </Link>
          </NavbarContent>

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

          <NavbarContent justify="end" className="gap-4">
            <NavbarItem className="overflow-hidden hidden md:flex isolate">
              <ActivityIndicator initialData={initialState} />
            </NavbarItem>

            <NavbarItem className={`md:hidden ${isMenuOpen ? "hidden" : "block"}`}>
              <div className="relative">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <div className="absolute inset-0 h-3 w-3 rounded-full bg-green-500 animate-ping" />
              </div>
            </NavbarItem>

            <NavbarMenuToggle
              className="lg:hidden"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            />
          </NavbarContent>

          <NavbarMenu
            className="bg-transparent mt-4"
            style={{ zIndex: 49 }}
          >
            {/* Menu content wrapper with mask */}
            <div className="relative">


              {/* Menu content */}
              <motion.div
                variants={{
                  enter: {
                    y: 0,
                    opacity: 1,
                    transition: {
                      duration: 0.2,
                      ease: "easeOut"
                    }
                  },
                  exit: {
                    y: "-30%",
                    opacity: 0,
                    transition: {
                      duration: 0.2,
                      ease: "easeIn"
                    }
                  }
                }}
                initial={{ y: "-30%", opacity: 0 }}
                animate="enter"
                exit="exit"
                style={{ zIndex: 1 }}
              >
                {menuItems.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className=""
                  >
                    <div className="font-semibold text-xl mb-2">{item.name}</div>
                    {item.links.map((link, linkIndex) => (
                      <NavbarMenuItem
                        key={`${link.text}-${linkIndex}`}
                        className="mb-1"
                      >
                        <Link
                          href={link.href}
                          className="w-full py-2 text-lg hover:text-primary transition-colors"
                          onClick={() => handleMenuChange(false)}
                        >
                          {link.text}
                        </Link>
                      </NavbarMenuItem>
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>
          </NavbarMenu>
        </Navbar>

        {/* Border at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 border-b border-black/10" />
      </div>
    </>
  );
}