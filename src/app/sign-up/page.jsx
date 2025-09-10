// app/sign-up/page.js
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return <SignUp afterSignUpUrl="/dashboard" />
}
