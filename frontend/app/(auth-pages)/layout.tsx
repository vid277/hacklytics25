export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex flex-col gap-12 items-start h-[calc(100vh-10rem)]">
      {children}
    </div>
  );
}
