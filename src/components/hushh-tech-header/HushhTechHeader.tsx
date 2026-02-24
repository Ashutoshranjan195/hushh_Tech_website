/**
 * HushhTechHeader — Reusable sticky header component
 * Clean nav bar with Hushh logo, brand name, and help button.
 *
 * Usage:
 *   <HushhTechHeader onHelpClick={() => console.log('help')} />
 *   <HushhTechHeader fixed={false} />  // non-fixed variant
 */
import React from "react";
import hushhLogo from "../images/Hushhogo.png";

interface HushhTechHeaderProps {
  /** Callback when help icon is clicked */
  onHelpClick?: () => void;
  /** Whether the header is fixed to top (default: true) */
  fixed?: boolean;
  /** Extra classes on the root container */
  className?: string;
}

const HushhTechHeader: React.FC<HushhTechHeaderProps> = ({
  onHelpClick,
  fixed = true,
  className = "",
}) => {
  const positionClasses = fixed
    ? "fixed top-0 left-0 right-0 z-50"
    : "relative z-0";

  return (
    <header
      className={`${positionClasses} bg-white px-6 py-4 flex justify-between items-center border-b border-gray-100 transition-all duration-300 ${className}`}
    >
      {/* Logo + Brand */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 border border-gray-200 rounded-xl flex items-center justify-center shrink-0 bg-white overflow-hidden">
          <img
            src={hushhLogo}
            alt="Hushh Logo"
            className="w-7 h-7 object-contain"
          />
        </div>
        <h1 className="text-[14px] font-semibold tracking-[0.15em] uppercase text-gray-900 font-sans whitespace-nowrap">
          Hushh Technologies
        </h1>
      </div>

      {/* Help button */}
      <button
        onClick={onHelpClick}
        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
        aria-label="Help"
        tabIndex={0}
      >
        <span className="material-symbols-outlined text-gray-500 text-[26px] font-light">
          help
        </span>
      </button>
    </header>
  );
};

export default HushhTechHeader;
