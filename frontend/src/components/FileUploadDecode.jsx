import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const FileUploadDecode = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("");

  const [isUploaded, setIsUploaded] = useState(false);
  const [isDecoded, setIsDecoded] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setIsUploaded(false);
    setIsDecoded(false);
    setIsDownloaded(false);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploadedFileName", filename);

    const response = await axios.post("/upload-file", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setFilename(response.data.uploadedFileName);
    console.log(response.data);
    if (response.data.success == true) {
      setIsUploaded(true);
    }
  };

  const handleDecode = async () => {
    const response = await axios.get(`/decode?uploadedFileName=${filename}`);
    console.log(response.data.huffmanTree);
    setIsDecoded(true);
    onUpload(response.data.huffmanTree);
  };

  const handleDownload = async () => {
    const fileUrl = `/decode/download?uploadedFileName=${filename}`;
    window.open(fileUrl, "_blank");
    setIsDownloaded(true);
  };

  return (
    <div className="flex-col">
      <input className="text-white" type="file" onChange={handleFileChange} />
      <br />
      <div className="flex items-center">
        <button
          onClick={handleUpload}
          className="m-4 p-2 text-white rounded-lg drop-shadow-custom-purple ring-1 ring-purple-600 hover:bg-purple-200 hover:text-black"
        >
          Upload Compressed .bin file
        </button>
        <p className="text-white">
          {isUploaded && "File uploaded successfully ✅"}
        </p>
      </div>
      <div className="flex items-center">
        <button
          onClick={handleDecode}
          className="m-4 p-2 text-white rounded-lg drop-shadow-custom-purple ring-1 ring-purple-600 hover:bg-purple-200 hover:text-black"
        >
          Decode and Generate Tree
        </button>
        <p className="text-white">
          {isDecoded && "File Decoded successfully 😊"}
        </p>
      </div>
      <div className="flex items-center">
        <button
          onClick={handleDownload}
          className="m-4 p-2 text-white rounded-lg drop-shadow-custom-purple ring-1 ring-purple-600 hover:bg-purple-200 hover:text-black"
        >
          Download Decoded file
        </button>
        <p className="text-white">
          {isDownloaded && "File download initiated 🤘"}
        </p>
      </div>
    </div>
  );
};

export default FileUploadDecode;

FileUploadDecode.propTypes = {
  onUpload: PropTypes.func.isRequired,
};
