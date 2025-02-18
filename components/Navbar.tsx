import { useState, useEffect } from "react";
import { ModeToggle } from "./ModeToggle";

const FloatingNavbar = () => {
  return (
    <nav className="fixed top-2 sm:top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] sm:w-full px-4 sm:px-6 py-2 sm:py-3 rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-foreground">
            Rizzler
          </h1>
          <p className="text-xs sm:text-sm text-foreground/50">
            Like the Rizzler of Oz, guiding the lost.
          </p>
        </div>
        <ModeToggle />
      </div>
    </nav>
  );
};

export default FloatingNavbar;
