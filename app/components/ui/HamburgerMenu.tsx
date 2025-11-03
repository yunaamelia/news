"use client";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function HamburgerMenu({ isOpen, onClick }: HamburgerMenuProps) {
  return (
    <button
      onClick={onClick}
      className="group relative h-10 w-10 rounded-xl p-2.5 text-gray-400 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white lg:hidden"
      aria-label="Toggle menu"
      aria-expanded={isOpen}
    >
      <div className="flex flex-col items-center justify-center space-y-1.5">
        <span
          className={`block h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
            isOpen ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
            isOpen ? "-translate-y-2 -rotate-45" : ""
          }`}
        />
      </div>
    </button>
  );
}
