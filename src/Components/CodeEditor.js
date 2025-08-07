import React, { useState } from "react";
import axios from "axios";

const CodeEditor = () => {
    const [output, setOutput] = useState(""); // State to store output

    const runCode = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:5000/run", {
                code: "a = 15\nb = 12\nres = a + b\nprint(res)"
            }, {
                headers: { "Content-Type": "application/json" }
            });

            console.log("API Response:", response.data); // Log full response
            setOutput(response.data.output || "No output received.");
        } catch (error) {
            console.error("Error:", error);
            setOutput("Error occurred.");
        }
    };

    return (
        <div>
            <h2>Try It Yourself</h2>
            <textarea rows="5" cols="50" placeholder="Write your Python code here..." />
            <br />
            <button onClick={runCode}>Run Code</button>
            <h3>Output:</h3>
            <div style={{ background: "#000", color: "#0f0", padding: "10px" }}>
                {output}
            </div>
        </div>
    );
};

export default CodeEditor;
