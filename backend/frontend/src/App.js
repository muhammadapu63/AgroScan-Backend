import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(""); 
  };

  const onUpload = async () => {
    if (!file) return alert("দয়া করে আগে একটি আলুর পাতার ছবি সিলেক্ট করুন!");
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // আমরা ব্যাকএন্ড সার্ভার ৫০০০ পোর্টে চালাবো
      const res = await axios.post('http://192.168.0.113:5000/api/predict', formData);
      setResult(res.data.result);
    } catch (err) {
      alert("সার্ভার কানেক্ট হচ্ছে না! নিশ্চিত করুন node server.js চালু আছে।");
    }
    setLoading(false);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial', backgroundColor: '#f4f4f4', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ color: '#2e7d32' }}>🌿 AgriSmart Phase-I Demo</h1>
      <div style={{ margin: 'auto', padding: '30px', backgroundColor: 'white', width: '400px', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <input type="file" onChange={onFileChange} accept="image/*" />
        <br /><br />
        {preview && <img src={preview} alt="Preview" style={{ width: '100%', borderRadius: '10px' }} />}
        <br /><br />
        <button onClick={onUpload} style={{ padding: '10px 20px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {loading ? "Analyzing..." : "Check Leaf Health"}
        </button>
      </div>
      {result && (
        <div style={{ marginTop: '20px', padding: '15px', border: '2px solid green', borderRadius: '10px', display: 'inline-block', backgroundColor: '#e8f5e9' }}>
          <h2>Result: <span style={{ color: 'red' }}>{result}</span></h2>
        </div>
      )}
    </div>
  );
}

export default App;