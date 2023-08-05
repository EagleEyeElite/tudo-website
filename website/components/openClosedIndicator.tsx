import {ActivityIndicatorState} from "../pages/api/activityIndicator";
import React from "react";
import useSWR, {Fetcher} from "swr";


const fetcher: Fetcher<ActivityIndicatorState, string> = async (api) => {
  const res = await fetch(api)
  return res.json()
}

function openButtonWithoutHoverEffect() {
  return <a
    className={`
      relative
      isolate
      overflow-hidden
      
      mx-3 py-3 px-12 lg:px-8 
      font-bold
      text-white hover:text-black
      ring-1 ring-inset ring-black
      shadow-lg shadow-green-500/50 hover:shadow-transparent
      duration-200 transition-all
      
      before:absolute before:inset-0 before:-z-10
      before:bg-gradient-to-br before:from-green-400 before:via-green-500 before:to-green-600
      before:hover:opacity-0 before:transition-all before:duration-200
      
      after:absolute after:inset-0
      after:bg-gradient-to-r after:from-transparent after:via-rose-100/30 after:to-transparent
      after:hover:opacity-0 after:-translate-x-full after:animate-[shimmer_4s_infinite]
    `}
    href={"google.com"}
  >
    Geöffnet
  </a>

}

function OpenButtonWithHoverEffect() {
  return <a
    className={`
      group
      flex
      relative
      mx-3 
      
      before:absolute before:inset-0 before:-z-10
      before:bg-gradient-to-br before:from-green-400 before:via-green-500 before:to-green-600
      before:hover:opacity-0 before:transition-all before:duration-50
      
      after:absolute after:inset-0 after:-z-30
      after:shadow-lg after:shadow-green-500/50
      after:hover:-translate-y-1.5
      after:duration-200 after:transition-all
  
    `}
    href={"google.com"}
  >
    <span
      className="
        relative
        isolate
        overflow-hidden
        py-3 px-12 lg:px-8
        font-bold text-white

        before:absolute before:inset-0 before:-z-10
        before:bg-gradient-to-tl before:from-green-400 before:to-green-600
        before:opacity-0 before:group-hover:opacity-100 before:transition-all before:duration-50

        after:absolute after:inset-0
        after:bg-gradient-to-r after:from-transparent after:via-rose-100/30 after:to-transparent
        after:group-hover:opacity-0 after:-translate-x-full after:animate-[shimmer_4s_infinite]
        after:z-20
        "
    >
      Geöffnet
    </span>
  </a>
}

export default function OpenClosedIndicator() {
  const {data, error} = useSWR("/api/activityIndicator", fetcher)
  if (error) return <div>Failed to load</div>
  if (!data) return <a
    className={`mx-3 font-bold bg-black hover:bg-transparent hover:text-black border border-black text-white py-3 px-12 lg:px-8 duration-200 transition-colors `}>
    Öffnungszeiten
  </a>

  if (data.open) {
    return OpenButtonWithHoverEffect()
  } else {
    return <a
        className={`mx-3 font-bold bg-black hover:bg-transparent hover:text-black border border-black text-white py-3 px-12 lg:px-8 duration-200 transition-colors`}>
        Geschlossen
      </a>
  }
}
