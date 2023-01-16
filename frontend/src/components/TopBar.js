export default function TopBar({ resetGraph }) {
  return (
    <div className="absolute top-0 left-0 h-16 w-screen
      flex flex-row items-center">
      <button className="button z-10"
        onClick={resetGraph}>RESET</button>
      <div className="z-10 w-40">
        <label htmlFor="range" className="text-sm">Minimum node score: 30</label>
        <input id="range" type="range" min={-100} max={100} className="w-full bg-gray" />
      </div>
    </div>
  );
}