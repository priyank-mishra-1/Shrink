import { useState, useRef, useEffect } from "react";
const References = () => {
  const [showReferences, setShowReferences] = useState(false);

  const referencesEndRef = useRef(null);

  const scrollToBottom = () => {
    referencesEndRef.current?.scrollIntoView({ behaviour: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [showReferences]);

  const toggleReferences = () => {
    setShowReferences(!showReferences);
  };

  return (
    <div className="m-2 p-1 text-xs lg:text-base lg:m-5 lg:p-2 w-full flex flex-col items-center ">
      <div className="text-white">
        <button
          onClick={toggleReferences}
          className=" underline hover:underline hover:text-purple-300"
        >
          {showReferences ? "Hide References" : "Show References"}
        </button>
        {showReferences && (
          <div ref={referencesEndRef}>
            <p>Special thanks to these amazing resources: </p>
            <ul>
              <li className="hover:text-pink-400">
                <a
                  href="https://opendsa-server.cs.vt.edu/ODSA/Books/CS3/html/Huffman.html#id3"
                  target="_blank"
                >
                  👑 OpenDSA - CS3 Data Structures & Algorithms
                </a>
              </li>
              <li className="hover:text-pink-400">
                <a
                  href="https://codingchallenges.fyi/challenges/challenge-huffman"
                  target="_blank"
                >
                  👑 Coding Challenges -{" "}
                  <span className="hover:underline text-white">
                    www.codingchallenges.fyi
                  </span>{" "}
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default References;
