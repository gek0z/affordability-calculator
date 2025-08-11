function Footer() {
  return (
    <footer className="flex justify-center items-center p-4 w-full bg-light-grey">
      <p className="text-sm text-black">
        &copy; {new Date().getFullYear()} OpenRent - Affordability Calculator
      </p>
    </footer>
  );
}

export default Footer;
