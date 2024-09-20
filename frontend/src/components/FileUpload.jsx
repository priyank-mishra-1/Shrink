import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const FileUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("");

  const [isUploaded, setIsUploaded] = useState(false);
  const [isEncoded, setIsEncoded] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setIsUploaded(false);
    setIsEncoded(false);
    setIsDownloaded(false);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploadedFileName", filename);

    const response = await axios.post(
      "http://localhost:5000/upload-file",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    setFilename(response.data.uploadedFileName);
    console.log(response.data);
    if (response.data.success == true) {
      setIsUploaded(true);
    }
  };

  const handleEncode = async () => {
    // const formData = new FormData();
    // formData.append('uploadedFileName', filename);

    const response = await axios.get(
      `http://localhost:5000/encode?uploadedFileName=${filename}`
    );
    console.log(response.data.huffmanTree);
    setIsEncoded(true);
    onUpload(response.data.huffmanTree);
  };

  const handleDownload = async () => {
    const fileUrl = `http://localhost:5000/encode/download?uploadedFileName=${filename}`;
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
          Upload Text File
        </button>
        <p className="text-white">
          {isUploaded && "File uploaded successfully ✅"}
        </p>
      </div>
      <div className="flex items-center">
        <button
          onClick={handleEncode}
          className="m-4 p-2 text-white rounded-lg drop-shadow-custom-purple ring-1 ring-purple-600 hover:bg-purple-200 hover:text-black"
        >
          Encode and Generate Tree
        </button>
        <p className="text-white">
          {isEncoded && "File Encoded successfully 👾"}
        </p>
      </div>
      <div className="flex items-center">
        <button
          onClick={handleDownload}
          className="m-4 p-2 text-white rounded-lg drop-shadow-custom-purple ring-1 ring-purple-600 hover:bg-purple-200 hover:text-black"
        >
          Download Encoded file
        </button>
        <p className="text-white">
          {isDownloaded && "File download initiated 🤘"}
        </p>
      </div>
    </div>
  );
};

export default FileUpload;

FileUpload.propTypes = {
  onUpload: PropTypes.func.isRequired,
};
