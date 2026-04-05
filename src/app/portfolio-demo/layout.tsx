import DarkForcer from "./DarkForcer";

export default function PortfolioDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DarkForcer />
      {children}
    </>
  );
}
