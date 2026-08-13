import React from "react";
import { Globe } from "lucide-react";

export default function Footer() {
  const footerSections = [
    {
      title: "Support",
      links: [
        "Help Centre",
        "AirCover",
        "Anti-discrimination",
        "Disability support"
      ]
    },
    {
      title: "Hosting",
      links: [
        "Airbnb your home",
        "AirCover for Hosts",
        "Hosting resources",
        "Community forum"
      ]
    },
    {
      title: "Airbnb",
      links: [
        "Newsroom",
        "New features",
        "Careers",
        "Investors"
      ]
    }
  ];

  return (
    <footer className="w-full bg-[var(--color-surface-muted)] border-t border-[var(--color-border-subtle)] text-[var(--color-text-primary)]">
      <div className="max-w-7xl mx-auto px-6 xl:px-10 py-12">
        {/* Top section: Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-[var(--color-border-subtle)]">
          {footerSections.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-4">
              <h3 className="font-semibold text-sm tracking-wider uppercase text-[var(--color-text-primary)]">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a 
                      href="#" 
                      className="text-sm text-[var(--color-text-secondary)] hover:text-black hover:underline transition-colors duration-150"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section: Legal details and Socials */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-8 text-sm text-[var(--color-text-secondary)]">
          {/* Left: Copyright and links */}
          <div className="flex flex-col md:flex-row items-center gap-2 text-center md:text-left">
            <span>© {new Date().getFullYear()} Airbnb, Inc.</span>
            <span className="hidden md:inline">·</span>
            <div className="flex flex-wrap justify-center gap-2">
              <a href="#" className="hover:underline hover:text-black">Privacy</a>
              <span>·</span>
              <a href="#" className="hover:underline hover:text-black">Terms</a>
              <span>·</span>
              <a href="#" className="hover:underline hover:text-black">Sitemap</a>
              <span>·</span>
              <a href="#" className="hover:underline hover:text-black">UK Modern Slavery Act</a>
            </div>
          </div>

          {/* Right: Region selector & Social links */}
          <div className="flex items-center gap-6">
            {/* Region / Currency selectors */}
            <div className="flex items-center gap-4 font-semibold text-black">
              <button className="flex items-center gap-1.5 hover:underline cursor-pointer">
                <Globe size={16} />
                <span>English (GB)</span>
              </button>
              <button className="flex items-center gap-0.5 hover:underline cursor-pointer">
                <span className="text-sm font-semibold pr-0.5">$</span>
                <span>USD</span>
              </button>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 text-black">
              <a href="#" aria-label="Facebook" className="hover:opacity-80 transition-opacity">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="hover:opacity-80 transition-opacity">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="hover:opacity-80 transition-opacity">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.01 3.71.054 1.14.051 1.76.24 2.17.4.54.21.93.46 1.34.87.41.41.66.8.87 1.34.16.41.35 1.03.4 2.17.044.926.054 1.28.054 3.71s-.01 2.784-.054 3.71c-.051 1.14-.24 1.76-.4 2.17a3.813 3.813 0 01-.87 1.34 3.813 3.813 0 01-1.34.87c-.41.16-1.03.35-2.17.4-.927.043-1.28.054-3.71.054s-2.784-.01-3.71-.054c-1.14-.051-1.76-.24-2.17-.4a3.813 3.813 0 01-1.34-.87 3.813 3.813 0 01-.87-1.34c-.16-.41-.35-1.03-.4-2.17C2.01 14.398 2 14.044 2 11.615s.01-2.784.054-3.71c.051-1.14.24-1.76.4-2.17a3.813 3.813 0 01.87-1.34 3.813 3.813 0 011.34-.87c.41-.16 1.03-.35 2.17-.4.926-.044 1.28-.054 3.71-.054zm0 1.917c-2.4 0-2.685.01-3.631.053-.88.04-1.354.187-1.673.31-.421.164-.72.36-.1.034.72a2.2 2.2 0 00-1.035 1.035c-.124.319-.27.793-.311 1.673-.044.945-.053 1.23-.053 3.63s.01 2.686.053 3.631c.04.88.187 1.354.31 1.673.164.421.36.72.72 1.034.319.319.615.53 1.035.72.319.124.793.27 1.673.311.945.044 1.23.053 3.63.053s2.686-.01 3.631-.053c.88-.04 1.354-.187 1.673-.31a2.2 2.2 0 001.035-1.035c.124-.319.27-.793.311-1.673.044-.945.053-1.23.053-3.63s-.01-2.686-.053-3.631c-.04-.88-.187-1.354-.31-1.673a2.2 2.2 0 00-1.035-1.035c-.319-.124-.793-.27-1.673-.311-.946-.044-1.23-.053-3.63-.053zm0 2.766a4.932 4.932 0 100 9.863 4.932 4.932 0 000-9.863zm0 7.078a2.146 2.146 0 110-4.291 2.146 2.146 0 010 4.291zm5.908-7.481a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
