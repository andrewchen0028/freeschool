export default function TopBar({ resetGraph }) {
  return (
    <div className="absolute top-0 left-0 h-16 w-screen
      flex items-center">
      <button className="rounded-sm bg-white m-2 p-2
        shadow-md transition-all z-10
        hover:bg-neutral-100
        active:bg-neutral-200"
        onClick={resetGraph}>RESET</button>
    </div>
  );
}