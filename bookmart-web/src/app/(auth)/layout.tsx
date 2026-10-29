/** Auth screens are a single centered column on the app background, as in the app. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen justify-center bg-app-bg px-6 py-10">
      <div className="w-full max-w-[420px]">{children}</div>
    </main>
  );
}
