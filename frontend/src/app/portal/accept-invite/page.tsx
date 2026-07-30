import { acceptInviteAction } from "../actions";
import { PasswordSetForm } from "../password-set-form";

export default async function AcceptInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-amber-50 px-6">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-semibold text-stone-900">Activate your portal account</h1>
        <p className="max-w-sm text-sm text-stone-600">Set a password to access your matter details.</p>
      </div>
      <PasswordSetForm token={token ?? ""} action={acceptInviteAction} submitLabel="Activate account" />
    </div>
  );
}
