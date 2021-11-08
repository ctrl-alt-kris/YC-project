import { useState } from "react";

const Upload = () => {
    const [selectedFile, setSelectedFile] = useState(null)
  return (
    <div>
      <h1>Upload</h1>
      <form>

        <input
          type="file"
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
      </form>
    </div>
  );
};

export default Upload;
