import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";

export default function Suite() {
  const [animationStage, setAnimationStage] = useState("initial");

  useEffect(() => {
    // Start the animation sequence after component mounts
    const timer1 = setTimeout(() => {
      setAnimationStage("titleMoving");
    }, 1000); // Wait 1 second before starting

    const timer2 = setTimeout(() => {
      setAnimationStage("buttonsAppearing");
    }, 2000); // Start button animation 2 seconds after title starts moving

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);
  const navigate = useNavigate();

  const gradientStyle = {
    background:
      "linear-gradient(135deg, #465b45 0%, #55872e 25%, #66a317 50%, #77bf00 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#f8f8f7" }}
    >
      <div className="text-center">
        <div
          className={`text-8xl md:text-9xl font-semibold tracking-tight transition-all duration-1000 ease-out ${
            animationStage === "initial" ? "mb-0" : " -translate-y-8"
          }`}
          style={gradientStyle}
        >
          suite.
          <p
            className="text-xl md:text-2xl font-semibold tracking-tight"
            style={gradientStyle}
          >
            a blockchain platform for all corporate environments
          </p>
        </div>

        <div
          className={`flex gap-4 justify-center transition-all duration-800 ease-out ${
            animationStage === "buttonsAppearing"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <Button
            onClick={() => navigate("/register")}
            className="px-6 py-2 rounded-lg font-medium text-base transition-all duration-200 hover:scale-105 hover:shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, #465b45 0%, #55872e 25%, #66a317 50%, #77bf00 100%)",
              color: "white",
            }}
          >
            Get Started
          </Button>

          <Button
            onClick={() => navigate("/login")}
            className="px-6 py-2 rounded-lg font-medium text-base border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            style={{
              borderColor: "#55872e",
              ...gradientStyle,
            }}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}
