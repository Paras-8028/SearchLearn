import Link from "next/link";
import { Container } from "./container";

export function Footer() {
  return (
    <footer className="border-t">
      <Container className="flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold">SearchLearn</p>

          <p className="mt-1 text-sm text-muted-foreground">
            Learn smarter. Search deeper.
          </p>
        </div>

        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/courses" className="hover:text-foreground">
            Courses
          </Link>

          <Link href="/search" className="hover:text-foreground">
            Search
          </Link>

          <Link href="/learn" className="hover:text-foreground">
            Learn
          </Link>
        </div>
      </Container>
    </footer>
  );
}