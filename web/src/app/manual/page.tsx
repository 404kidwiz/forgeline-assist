import { redirect } from "next/navigation";

// ponytail: /manual has no meaning without a docId (nothing to read); Procedures is
// the discovery view for picking one, so bare /manual sends the user there instead
// of guessing a default document.
export default function ManualIndexPage() {
  redirect("/procedures");
}
