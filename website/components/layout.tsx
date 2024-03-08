import Alert from './alert'
import Footer from './footer'
import Meta from './meta'
import {Navbar} from "./navbar";
import React from "react";
import {ActivityIndicatorState} from "../pages/api/activityIndicator";

interface Props {
  children: React.ReactNode
  preview: boolean
  activityIndicator: ActivityIndicatorState
}

export default function Layout(
  {preview, children, activityIndicator}
    : Props) {
  return (
    <>
      <Meta/>
      <div className="min-h-screen">
        <Navbar activityIndicator={activityIndicator}/>
        <Alert preview={preview} />
        <main>{children}</main>
      </div>
      <Footer/>
    </>
  )
}
