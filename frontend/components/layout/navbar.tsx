'use client'

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import TuDoLogo from "../../public/assets/tudo-logo.svg";
import {type ActivityIndicatorState, getActivityIndicator} from "@/lib/api/activityIndicator";
import ActivityIndicator from "@/components/layout/openClosedIndicator";

interface MainNavbarProps {
  initialState: ActivityIndicatorState;
}

export default function MainNavbar({ initialState }: MainNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  return (
    <>
      <Navbar
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        className="fixed top-0 bg-white/70 border-b border-black/10 backdrop-blur-md backdrop-saturate-150 z-50"
        maxWidth="full"
        height="4rem"
        isBlurred
      >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand as={Link} href="/">
            <Image src={TuDoLogo} alt="TuDo" className="h-10 w-fit" />
            <h2 className="text-3xl font-bold tracking-tighter text-left ml-2 hidden sm:inline">
              Makerspace
            </h2>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link href="#">
              Features
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link href="#" aria-current="page">
              Customers
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="#">
              Integrations
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <ActivityIndicator
              fetchFnAction={getActivityIndicator}
              initialData={initialState}
            />
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="w-full"
                href="#"
              >
                {item}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </>
  );
}
