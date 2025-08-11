import { LucideGithub } from "lucide-react";

function Footer() {
  return (
    <footer className="flex justify-center items-center p-4 w-full bg-light-grey">
      <p className="text-sm text-black">
        &copy; {new Date().getFullYear()} OpenRent - Affordability Calculator -{" "}
        <a
          href="https://github.com/gek0z/affordability-calculator"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-dark-grey transition-colors duration-300"
        >
          <LucideGithub className="w-4 h-4 inline-block" /> GitHub
        </a>
      </p>
    </footer>
  );
}

export default Footer;
