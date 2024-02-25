import React from "react";
import Parrot from "../../public/assets/parrot.jpg";
import Club from "../../public/assets/club.jpg";
import Party from "../../public/assets/party.jpg";
import CafeBanner1 from "../../public/assets/cafeBanner.jpg";
import CafeBanner2 from "../../public/assets/cafeBanner2.jpg";
import CafeBanner3 from "../../public/assets/cafeBanner3.jpg";
import Image from 'next/image'
import HeroImage from "../../components/hero-image";


export default function RootLayout({children,}: {
  children: React.ReactNode
}) {
  return (<>
    <div className="flex justify-center">
      <div>
        <div className="min-h-[80vh] flex-col flex">
          <h2
            //data-tina-field={tinaField(props, "title")}
            className={`w-full relative	my-8 text-6xl font-extrabold tracking-normal text-center title-font`}
          >
            <span
              className={`bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-300 dark:to-blue-500`}
            >
              Semester Opening Party - 27.10.23
            </span>
          </h2>

          <HeroImage src={Club.src}/>
          {/*


        <div className="px-4 w-full isolate">
          <div
            //data-tina-field={tinaField(props, "heroImg")}
            className="relative max-w-4xl lg:max-w-5xl mx-auto"
          >
            <img
              src={Parrot.src}
              className="absolute block rounded-lg w-full h-auto blur-2xl brightness-150 contrast-[0.9] dark:brightness-150 saturate-200 opacity-50 dark:opacity-30 mix-blend-multiply dark:mix-blend-hard-light"
              aria-hidden="true"
              alt=""
            />
            <img
              src={Parrot.src}
              alt={"hmmm"}
              className="relative z-10 mb-14 block rounded-lg w-full h-auto opacity-100"
            />
          </div>
        </div>
        */}

        </div>
        <div className="mt-8">
          <article className="prose">
            {children}
          </article>
        </div>
      </div>
    </div>
  </>)
}
