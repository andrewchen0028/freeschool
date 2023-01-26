export function TopBar({ resetGraph }: {
  resetGraph: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <div className="absolute top-0 left-0 h-16 w-screen
      flex flex-row items-center">
      <button className="button z-10" onClick={resetGraph}>RESET</button>
    </div>
  )
}