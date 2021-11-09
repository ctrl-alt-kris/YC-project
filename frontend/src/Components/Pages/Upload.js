import { useState } from "react";

const Upload = () => {
    const [selectedFile, setSelectedFile] = useState(null)

    const handleSubmit = (e) => {
        e.preventDefault()
        var form = new FormData()
        form.append('file', selectedFile)

        fetch('http://localhost:8000/upload-csv/1', {
        method: 'POST',
        body: form
        })
    }
  return (
    <div>
      <h1>Upload</h1>
      <form onSubmit={handleSubmit} >

        <input
          type="file"
          onChange={(e) => setSelectedFile((e.target.files[0]))}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Upload;