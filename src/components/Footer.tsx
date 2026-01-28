import SocialLinks from "./SocialLinks";

const Footer = () => {
  return (
    <footer className="mt-12 border-t border-border/30 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-heading">
            Ali Saad <span className="text-primary">Khan</span>
          </h3>
          <p className="text-muted-foreground">Full-Stack Solutions Architect</p>
        </div>
        <SocialLinks />
      </div>
      <div className="mt-6 border-t border-border/20 pt-4 text-center text-sm text-muted-foreground">
        © 2026 Ali Saad Khan. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;