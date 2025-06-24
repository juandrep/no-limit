import { Radio } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Left side - Brand */}
        <div className="flex items-center space-x-2">
          <Radio className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg">No Limit</span>
        </div>

        {/* Right side - Copyright */}
        <div className="text-sm text-muted-foreground">
          © 2020 - {currentYear} All rights reserved
        </div>
      </div>
    </footer>
  );
}
