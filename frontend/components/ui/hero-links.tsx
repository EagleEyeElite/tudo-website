import React, {useState, useEffect, useRef} from "react";
import { FaAngleRight } from 'react-icons/fa';

interface Link {
  text: string;
  href: string;
}

interface Group {
  name: string;
  links: Link[];
}

type CustomLinkProps = {
  link: Group;
  isOpen: boolean;
  toggleDropdown: () => void;
  itemKey: number;
};

const CustomLinkItem: React.FC<CustomLinkProps> = ({ link, isOpen, toggleDropdown, itemKey }) => {
  // https://flowbite.com/docs/components/dropdowns/

  return (
    <li key={itemKey} className="relative inline-block font-bold whitespace-nowrap text-gray-900  text-xl md:text-2xl">
      <button
        onClick={toggleDropdown}
        className={`
          inline-flex items-center w-full px-7 py-2
          hover:underline hover:text-indigo-600 hover:bg-gray-100
          ${isOpen && 'underline text-indigo-600 bg-gray-100'}
        `}
        type="button"
      >
        {link.name}
        <FaAngleRight className={`ml-2 ${isOpen ? 'transform rotate-90' : ''} transition-transform duration-200`}/>
      </button>
      {isOpen && (
        <ul className="
          absolute z-10 w-fit mx-3 mt-2 py-2
          origin-top-left
          rounded-lg shadow-lg bg-white border
          divide-y divide-gray-200"
        >
          {link.links.map((subLink, index) => (
            <li key={index} className="hover:bg-gray-100">
              <a href={subLink.href} className="block w-full px-4 py-2">
                {subLink.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};


const HeroLinks = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const quickLinksRef = useRef<HTMLUListElement>(null);

  const links = [
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (quickLinksRef.current && !quickLinksRef.current.contains(event.target)) {
        setOpenIndex(null); // Close all dropdowns
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Dependencies array is empty, so this effect runs only once after initial render

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // https://flowbite.com/docs/components/button-group/#default-example
  return (
    <ul
      ref={quickLinksRef}
      className="w-full md:w-fit flex flex-col md:items-center lg:order-last md:flex-row rounded-md shadow-sm divide-y md:divide-y-0 md:divide-x divide-gray-200 border border-gray-200 bg-white"
      role="group"
    >
      {links.map((link, index) => (
        <CustomLinkItem
          key={index}
          itemKey={index}
          link={link}
          isOpen={openIndex === index}
          toggleDropdown={() => toggleDropdown(index)}
        />
      ))}
    </ul>
  );
};

export default HeroLinks;