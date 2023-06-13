import Alert from './alert'
import Footer from './footer'
import Meta from './meta'
import {Navbar} from "./navbar";
import React from "react";

export default function Layout({ preview, children }) {
  return (
    <>
      <Meta />
        <div className="min-h-screen">
          <Navbar />
          {/*<Alert preview={preview} />*/}
          <main>{children}</main>
        </div>
        <Footer />
    </>
  )
}
