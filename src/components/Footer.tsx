const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/50 py-6 px-4">
      <p className="text-center text-xs font-mono text-primary/40">
        © {year} @habu.in — All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
