import React, { useState } from "react";
// import OutlineButton from "./OutlineButton";
import logo from "../assets/logo.jpg";
// import CTAButton from "./CTAButton";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import { Link } from "react-router-dom";
// import { GoDownload } from "react-icons/go";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={`font-inter ${
          !open && "shadow-md"
        } lg:shadow-md flex justify-between items-center px-10 py-5 z-2 relative`}
      >
        <Link className="flex items-center" to="/">
          <img src={logo} alt="Logo" className="h-12 w-12 cursor-pointer"></img>
          <p className="mx-2 italic font-medium text-lg text-ink">
            The Journal
          </p>
        </Link>
        <div className="hidden lg:flex gap-x-8 font-medium items-center">
          <Link
            to="/signup"
            className="hover:text-cta cursor-pointer  transition-all"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="hover:text-cta cursor-pointer  transition-all"
          >
            Log in
          </Link>
        </div>
        <div className="lg:hidden">
          {open ? (
            <RxCross2
              onClick={() => setOpen(false)}
              className="cursor-pointer text-xl text-ink"
            />
          ) : (
            <RxHamburgerMenu
              onClick={() => setOpen(true)}
              className="cursor-pointer text-xl text-ink"
            />
          )}
        </div>
      </div>

      {open && (
        <div className="lg:hidden text-xl md:text-lg absolute w-full z-10 bg-white px-5 pb-6 text-center shadow-md">
          <p className="my-2">
            <Link
              to="/"
              className="hover:text-cta cursor-pointer transition-all"
            >
              Home
            </Link>
          </p>
          <p className="my-2">
            <Link
              to="/signup"
              className="hover:text-cta cursor-pointer transition-all"
            >
              Signup
            </Link>
          </p>
          <p className="my-2">
            <Link
              to="/login"
              className="hover:text-cta cursor-pointer transition-all"
            >
              Log in
            </Link>
          </p>
          <br />
          {/* <CTAButton
            onClick={() => {
              window.open("roshithprakash_resume.pdf");
            }}
            text={
              <div className="flex gap-x-2 items-center">
                Resume
                <GoDownload className="text-lg" />
              </div>
            }
          /> */}
        </div>
      )}
    </>
  );
};

export default Navbar;
