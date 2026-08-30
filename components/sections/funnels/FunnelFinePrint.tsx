import Link from "next/link";

/* Fine print + privacy link (landing-pages specs, last section). The
   privacy link is the one non-CTA exit on a funnel page. Silent on
   hover (opt-in sfx rule); clicks sound sitewide already. */
export function FunnelFinePrint({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <footer className={className}>
      <p className="mx-auto max-w-[56ch] text-center text-small text-sec-mid">
        {text}
      </p>
      <p className="mt-4 text-center font-mono text-mono-sm uppercase text-sec-mid">
        <Link
          href="/privacy-policy/"
          className="underline-offset-4 transition-colors duration-[var(--dur-fast)] hover:text-sec-ink hover:underline"
        >
          Privacy Policy
        </Link>
        <span aria-hidden> / </span>
        <span>BigSquare Marketing © {new Date().getFullYear()}</span>
      </p>
    </footer>
  );
}
