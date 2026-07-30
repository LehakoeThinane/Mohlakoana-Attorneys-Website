import { LoginForm } from "./login-form";

export default function PortalLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-amber-50 px-6">
      <div className="flex flex-col items-center gap-1">
        <h1 className="text-2xl font-semibold text-stone-900">Client Portal</h1>
        <p className="text-sm text-stone-600">Mohlakoana Attorneys</p>
      </div>
      <LoginForm />
    </div>
  );
}
