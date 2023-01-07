export default function TopBar({ resetGraph }) {
  return (
    <div className="absolute top-0 left-0 h-16 w-screen
      flex items-center">
      <button className="button z-10"
        onClick={resetGraph}>RESET</button>
    </div>
  );
}