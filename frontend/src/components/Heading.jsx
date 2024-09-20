import { useState } from "react";

const Heading = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative h-auto flex justify-center">
      <h1
        className={`text-center my-16 text-white text-6xl font-bold drop-shadow-custom-white ${
          hovered ? "hidden" : ""
        }`}
        onMouseEnter={() => setHovered(true)}
      >
        Huffman Encoder
      </h1>
      <h1
        className={`text-center my-16 text-white text-6xl drop-shadow-custom-white ${
          hovered ? "" : "hidden"
        }`}
        onMouseLeave={() => setHovered(false)}
      >
        &#123;10110100&#125;{" "}
        <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-slate-500 to-pink-300 bg-clip-text text-transparent drop-shadow-none">
          Shrink.js
        </span>
      </h1>
    </div>
  );
};

export default Heading;
