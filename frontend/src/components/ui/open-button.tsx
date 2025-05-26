import {OPENING_HOURS_PATH} from '@/lib/constants';
import React from 'react';
import Link from 'next/link';

export function OpenButton() {
  return <Link
    className={`
      group
      flex
      relative
      mx-3 
      
      before:absolute before:inset-0 before:-z-10
      before:bg-linear-to-br before:from-green-400 before:via-green-500 before:to-green-600
      hover:before:opacity-0 before:transition-all before:duration-50
      
      after:absolute after:inset-0 after:-z-30
      after:shadow-lg after:shadow-green-500/50
      hover:after:-translate-y-1.5
      after:duration-200 after:transition-all
    `}
    href={OPENING_HOURS_PATH}
  >
    <span
      className="
  relative
  isolate
  overflow-hidden
  py-3 px-12 lg:px-8
  font-bold text-white

  before:absolute before:inset-0 before:-z-10
  before:bg-linear-to-tl before:from-green-400 before:to-green-600
  before:opacity-0 group-hover:before:opacity-100 before:transition-all before:duration-50

  after:absolute after:inset-0
  after:bg-linear-to-r after:from-transparent after:via-rose-100/30 after:to-transparent
  group-hover:after:opacity-0 after:-translate-x-full after:animate-[shimmer_4s_infinite]
  after:z-20
  "
    >
  Geöffnet
  </span>
  </Link>
}
