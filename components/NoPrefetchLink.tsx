import NextLink from "next/link";
import type { ComponentProps } from "react";

type LinkProps = ComponentProps<typeof NextLink>;

const NON_PREFETCH_PREFIXES = [
  "/admin",
  "/portal",
  "/account",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/auth",
  "/api",
];

function hrefPath(href: LinkProps["href"]): string {
  if (typeof href === "string") return href;
  return href.pathname?.toString() ?? "";
}

export default function NoPrefetchLink({ prefetch, ...props }: LinkProps) {
  const href = hrefPath(props.href);
  const isInternalPublicRoute = href.startsWith("/") &&
    !NON_PREFETCH_PREFIXES.some((prefix) => href === prefix || href.startsWith(`${prefix}/`));

  return (
    <NextLink
      {...props}
      prefetch={prefetch ?? (isInternalPublicRoute ? null : false)}
    />
  );
}
