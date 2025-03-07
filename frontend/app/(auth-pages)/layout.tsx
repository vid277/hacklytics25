export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  );
}
