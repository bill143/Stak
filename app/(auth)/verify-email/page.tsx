import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SearchParams = Promise<{ email?: string }>;

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { email } = await searchParams;

  return (
    <Card className="p-2">
      <CardHeader>
        <CardTitle className="text-xl">Confirm your email</CardTitle>
        <CardDescription>
          {email ? (
            <>We sent a confirmation link to <span className="text-foreground">{email}</span>.</>
          ) : (
            <>We sent you a confirmation link.</>
          )}{" "}
          Click the link in the email to finish creating your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>
          The email may take a minute to arrive. Check your spam folder if you don&apos;t see it.
        </p>
        <p>
          Already confirmed?{" "}
          <Link href="/signin" className="text-foreground underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
