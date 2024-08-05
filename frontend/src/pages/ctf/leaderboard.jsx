import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import { Button } from ""
import {Link} from "react-router-dom"
import { BiSolidHome } from 'react-icons/bi'
// import Navbar from './navbar'
const Leaderboard = ()=> {

  return (
      <div>
        {/* <Navbar/> */}
        
      <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col gap-4 items-center justify-center text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl">Coming Soon</h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              We're working on something amazing. Sign up to be the first to know when it launches.
            </p>
          </div>
          <div className="flex w-full max-w-sm items-center justify-center space-x-2">
            <div className="grid w-10 justify-self-end">
              <CalendarIcon className="h-6 w-6 justify-self-end" />
              <span className="sr-only">Days</span>
              <CalendarIcon className="h-6 w-6 justify-self-end" />
              <span className="sr-only">Hours</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="font-bold text-2xl md:text-3xl lg:text-4xl">
                30
                <span className="text-base md:text-xl lg:text-base">days</span>
              </div>
              <div className="font-bold text-2xl md:text-3xl lg:text-4xl">
                12
                <span className="text-base md:text-xl lg:text-base">hours</span>
              </div>
              <div className="font-bold text-2xl md:text-3xl lg:text-4xl">
                45
                <span className="text-base md:text-xl lg:text-base">mins</span>
              </div>
              <div className="font-bold text-2xl md:text-3xl lg:text-4xl">
                21
                <span className="text-base md:text-xl lg:text-base">secs</span>
              </div>
            </div>
          </div>
          <div className="flex w-full max-w-sm flex-col gap-2 min-[400px]:flex-row">
            <input className="max-w-xs w-full rounded-lg" placeholder="Enter your email" type="email" />
            <button size='btn glass bg-blue-300'>Sign Up</button>
          </div>
        </div>
      </div>
    </section><section className="w-full border-t">
        <div className="container py-6 px-4 md:px-6">
          <div className="flex flex-col gap-2 text-center">
            <p className="text-sm text-gray-500">Sign up to get notified when we launch</p>
            <ul className="flex justify-center gap-4">
              <li>
                <Link
                  className="rounded-full inline-block w-6 h-6 borde border-gray-200 shadow-sm hover:shadow transition-transform hover:scale-105 hover:rotate-3"
                  href="#"
                >
                  <FlagIcon className="w-6 h-6" />
                  <span className="sr-only">Icon</span>
                </Link>
              </li>
              <li>
                <Link
                  className="rounded-full inline-block w-6 h-6 border border-gray-200 shadow-sm hover:shadow transition-transform hover:scale-105 hover:rotate-3"
                  href="#"
                >
                  <FlagIcon className="w-6 h-6" />
                  <span className="sr-only">Icon</span>
                </Link>
              </li>
              <li>
                <Link
                  className="rounded-full inline-block w-6 h-6 border border-gray-20 shadow-sm hover:shadow transition-transform hover:scale-105 hover:rotate-3"
                  href="#"
                >
                  <FlagIcon className="w-6 h-6" />
                  <span className="sr-only">Icon</span>
                </Link>
              </li>
              <li>
                <Link
                  className="rounded-full inline-block w-6 h-6 border border-gray-200 shadow-sm hover:shadow transition-transform hover:scale-105 hover:rotate-3"
                  href="#"
                >
                  <FlagIcon className="w-6 h-6" />
                  <span className="sr-only">Icon</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section></div>
  )
  function CalendarIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
      </svg>
    )
  }
  
  
  function FlagIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" x2="4" y1="22" y2="15" />
      </svg>
    )
  }
}

export default Leaderboard;