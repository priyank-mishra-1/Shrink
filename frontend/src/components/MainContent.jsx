const MainContent = () => {
  return (
    <div className="flex justify-center">
      <div className="text-white my-3 w-1/2">
        <h3 className="text-2xl font-semibold mt-10 mb-2 hover:underline hover:decoration-slate-500">
          Introduction to{" "}
          <span className="bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-2xl tracking-tight text-transparent lg:text-3xl">
            Huffman Encoding
          </span>
        </h3>
        <p>
          Huffman encoding is a technique that allows us to reduce the amount of
          space needed to store data, particularly when some items in the data
          are more common than others. It&lsquo;s a type of{" "}
          <b>variable-length encoding</b>, which means that more frequent items
          get shorter codes, while less frequent ones get longer codes.
        </p>
        <h3 className="text-2xl font-semibold mt-10 mb-2 hover:underline hover:decoration-slate-500">
          Why Compression Matters
        </h3>
        <p>
          Imagine storing files on your computer. While files take up space,
          many of them, like text files, contain repeating characters or
          patterns. By compressing these files, we can save storage space and
          reduce the amount of data that needs to be transferred over the
          internet.
        </p>
        <p>
          Huffman encoding helps in <b>compressing data</b> by assigning shorter
          binary codes to frequently occurring characters and longer codes to
          less common characters. Once compressed, the file can be easily
          restored (or decoded) to its original state when needed.
        </p>
        <h3 className="text-2xl font-semibold mt-10 mb-2 hover:underline hover:decoration-slate-500">
          Fixed-Length vs. Variable-Length Encoding
        </h3>
        <p>
          In traditional encoding methods, like ASCII, every character is
          assigned a fixed-length code. For example, <b>ASCII</b> uses 7 or 8
          bits for each character, whether it&lsquo;s a common letter like
          &lsquo;E&rsquo; or a rare one like &lsquo;Z&rsquo;. This can be
          wasteful since &&lsquo;E&rsquo; appears far more frequently than
          &lsquo;Z&rsquo;.
        </p>
        <p>
          Huffman encoding takes a different approach by assigning{" "}
          <b>shorter codes</b> to more frequent characters and{" "}
          <b>longer codes</b> to less frequent ones. This way, the overall size
          of the encoded data is smaller, making the compression efficient.
        </p>
        <h3 className="text-2xl font-semibold mt-10 mb-2 hover:underline hover:decoration-slate-500">
          How Huffman Encoding Works
        </h3>
        <p>
          The process of Huffman encoding begins by analyzing the frequency of
          each character in the text. The more frequently a character appears,
          the shorter its code. Here&lsquo;s how it works step by step:
        </p>
        <ol className="list-decimal">
          <li>
            <b>Frequency Count:</b>
          </li>
          <p>We count how ofter each character appears in the text</p>
          <li>
            <b>Building the Huffman Tree:</b>
          </li>
          <p>
            The characters are arranged into a tree based on their frequencies.
            Characters with lower frequencies are placed deeper in the tree,
            while those with higher frequencies are closer to the root.
          </p>
          <li>
            <b>Assigning Codes:</b>
          </li>
          <p>
            Starting from the root of the tree, each left branch is assigned a{" "}
            <tt>0</tt>, and each right branch a <tt>1</tt>. By following this
            path, each character ends up with a unique binary code.
          </p>
        </ol>
        <p>
          For example, in English text, the letter &lsquo;&rsquo; might be
          assigned a short code like <tt>0</tt>, while a rarer letter like
          &lsquo;&rsquo; might be assigned a longer code like 11010.
        </p>
        <h3 className="text-2xl font-semibold mt-10 mb-2 hover:underline hover:decoration-slate-500">
          Decoding Huffman Codes
        </h3>
        <p>
          Decoding is simple. Each binary code corresponds to a unique path in
          the Huffman tree, which leads to a character. By following the binary
          digits (<tt>0</tt> for left, <tt>1</tt> for right), we can reconstruct
          the original message.
        </p>
        <h3 className="text-2xl font-semibold mt-10 mb-2 hover:underline hover:decoration-slate-500">
          Efficiency of Huffman Encoding
        </h3>
        <p>
          Huffman encoding is efficient in saving space, especially when there
          is a large variation in character frequencies. For example, in English
          text, where letters like &lsquo;E&rsquo;, &lsquo;T&rsquo;, and
          &lsquo;A&rsquo; are used much more frequently than letters like
          &lsquo;Q&rsquo; and &lsquo;Z&rsquo;, Huffman coding can save around
          30%–40% of space compared to fixed-length codes.
        </p>
        <p>
          However, if all characters appear with equal frequency, the space
          savings might not be as significant.
        </p>
        <h3 className="text-2xl font-semibold mt-10 mb-2 hover:underline hover:decoration-slate-500">
          Real-World Applications
        </h3>
        <p>
          Huffman encoding is used in many data compression algorithms and file
          formats, such as:
        </p>
        <ul className="list-disc">
          <li>
            <b>ZIP files</b>&nbsp;for compressing large collections of data
          </li>
          <li>
            <b>JPEG images</b>&nbsp;for reducing the size of digital images
          </li>
          <li>
            <b>MP3 files</b>&nbsp;for compressing audio data
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MainContent;
