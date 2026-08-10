import NextLink from "next/link";
import type { ComponentProps } from "react";

type NoPrefetchLinkProps = Omit<
  ComponentProps<typeof NextLink>,
  "prefetch"
>;

export default function NoPrefetchLink(props: NoPrefetchLinkProps) {
  return <NextLink {...props} prefetch={false} />;
}
