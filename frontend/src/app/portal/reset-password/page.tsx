import { resetPasswordAction } from "../actions";
import { PasswordSetForm } from "../password-set-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-amber-50 px-6">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-semibold text-stone-900">Set a new password</h1>
      </div>
      <PasswordSetForm token={token ?? ""} action={resetPasswordAction} submitLabel="Set new password" />
    </div>
  );
}
