import { useState, useEffect } from "react";
import { ModeToggle } from "./ModeToggle";
const FloatingNavbar = () => {
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full px-6 py-3 rounded-xl ">
      <div className="flex items-center justify-between">
        {/* App Title */}
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Rizzed AI
        </h1>
        {/* Dark Mode Toggle */}
        <ModeToggle />
      </div>
    </nav>
  );
};

export default FloatingNavbar;
