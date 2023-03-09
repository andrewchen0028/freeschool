import { useNavigate } from "react-router-dom";

export default function BottomBar() {
  const navigate = useNavigate();

  return (
    <div className="absolute bottom-0 left-0 h-16 w-screen
      flex flex-row-reverse items-center">
      <button className="button z-10 text-2xl"
        onClick={() => { navigate(`createNode`); }}>+</button>
    </div>
  );
}