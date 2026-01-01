import React from "react";

function Footer() {
  return (
    <footer className="flex flex-col md:flex-row justify-between items-center gap-2 w-full p-24 h-auto text-lg bg-gray-100">
      <div className="text-center">Crafted by Varshith</div>

      <div className="flex items-center gap-2">
        <a
          href="https://github.com/varshithdharmaj"
          className="text-gray-600 hover:text-black"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>

        <span>|</span>

        <a
          href="https://www.linkedin.com/in/varshithdharmaj/"
          className="text-gray-600 hover:text-black"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      </div>
    </footer>
  );
}

export default Footer;
