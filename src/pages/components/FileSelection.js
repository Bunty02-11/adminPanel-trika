const [selectedFile, setSelectedFile] = useState(null);
  const [fileExtension, setFileExtension] = useState('');
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [folderName, setFolderName] = useState(''); // State for folder name
  const [folders, setFolders] = useState([]); // State for storing folder names
  const [url, setUrl] = useState('');


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Read file extension
      const fileExtension = file.name.split('.').pop();
      setSelectedFile(file);
      setFileExtension(fileExtension);
      setUrl(triggerFunction(fileExtension, folderName)); // Update URL with folderName
      setIsFileSelected(true); // Enable upload button
    } else {
      setSelectedFile(null);
      setFileExtension('');
      setIsFileSelected(false); // Disable upload button
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target.result;
      // Perform your upload logic here
      // For demonstration, let's just log the file extension and content
      console.log('Selected File Extension:', fileExtension);
      console.log('File Content:', fileContent);

      // Example: Uploading file content using Fetch
      fetch(url, {
        method: 'PUT',
        body: fileContent,
        headers: {
          'Content-Type': 'application/octet-stream', // Set appropriate content type
        },
        mode: 'cors', // Enable CORS
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          console.log('File uploaded successfully:', response);
          // Reset selected file
          setSelectedFile(null);
          setFileExtension('');
          setIsFileSelected(false); // Disable upload button
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
          // Handle error
        });
    };
    reader.readAsDataURL(selectedFile);
  };

  return (

    
    <div>
      <input type="file" onChange={handleFileChange} />
      <select
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)} // Update folderName state
      >
        <option value="">Select Folder</option>
        {folders.map((folder, index) => (
          <option key={index} value={folder}>
            {folder}
          </option>
        ))}
      </select>
      <button onClick={handleUpload} disabled={!isFileSelected}>
        Upload
      </button>
    </div>
  );

export default FileUploader;