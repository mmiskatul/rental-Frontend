import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<React.ComponentProps<typeof Link>, "className" | "href"> {
  href?: string;
  to?: string;
  end?: boolean;
  className?: string | ((state: { isActive: boolean; isPending: boolean }) => string);
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, href, to, end, ...props }, ref) => {
    const pathname = usePathname() ?? "";
    const target = href ?? to ?? "/";
    const isActive = end ? pathname === target : pathname === target || pathname.startsWith(`${target}/`);
    const resolvedClassName =
      typeof className === "function" ? className({ isActive, isPending: false }) : className;

    return (
      <Link
        ref={ref}
        href={target}
        className={cn(resolvedClassName, isActive && activeClassName, pendingClassName)}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
