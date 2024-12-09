"use client";
import React, { useRef, useState, useEffect } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs'; // Import TensorFlow.js
import AiChatbot from 'components/aiChat';
const ObjectDetection = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [model, setModel] = useState<any>(null);
    const [isWebcam, setIsWebcam] = useState(false); // Default to image upload mode
    const [imageSrc, setImageSrc] = useState<string | null>(null); // Store uploaded image source
    const [detectionResult, setDetectionResult] = useState<string>(''); // Store the result of object detection

    // Load the COCO-SSD model and set up webcam
    useEffect(() => {
        const loadModel = async () => {
            const loadedModel = await cocoSsd.load();
            setModel(loadedModel);
        };

        loadModel();

        const startWebcam = async () => {
            if (videoRef.current) {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;
            }
        };

        if (isWebcam) {
            startWebcam();
        }

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                const tracks = stream.getTracks();
                tracks.forEach((track) => track.stop());
            }
        };
    }, [isWebcam]);

    // Object detection function
    const detectObjects = async () => {
        if (model && (videoRef.current || imageRef.current) && canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            let imageElement: HTMLImageElement | HTMLVideoElement | null = null;

            if (isWebcam) {
                imageElement = videoRef.current;
            } else if (imageSrc && imageRef.current) {
                imageElement = imageRef.current;
            }

            if (imageElement && context) {
                // Ensure the canvas dimensions match the image/video dimensions
                const imageWidth = imageElement.width || 640; // Default width if not available
                const imageHeight = imageElement.height || 480; // Default height if not available
                canvas.width = imageWidth;
                canvas.height = imageHeight;

                // Now perform detection
                const predictions = await model.detect(imageElement);

                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

                let resultString = '';
                predictions.forEach((prediction: any) => {
                    context.beginPath();
                    context.rect(
                        prediction.bbox[0],
                        prediction.bbox[1],
                        prediction.bbox[2],
                        prediction.bbox[3]
                    );
                    context.lineWidth = 2;
                    context.strokeStyle = 'red';
                    context.fillStyle = 'red';
                    context.stroke();
                    context.fillText(
                        `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
                        prediction.bbox[0],
                        prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10
                    );

                    resultString += `${prediction.class}: ${Math.round(prediction.score * 100)}%\n`;
                });

                setDetectionResult(resultString);
            }
        }

        // Recursively call detectObjects for continuous detection
        requestAnimationFrame(detectObjects);
    };


    useEffect(() => {
        if (model) {
            detectObjects();
        }
    }, [model, imageSrc, isWebcam]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleMode = () => {
        setIsWebcam((prev) => !prev);
        setImageSrc(null); // Reset image source when switching to webcam
        setDetectionResult(''); // Clear result when switching mode
    };

    return (
        <div style={styles.container}>

            <h2 className="text-3xl font-semibold leading-snug text-gray-800 transition-all duration-500 hover:text-blue-600 text-center">
                Visual Aid <span className="text-indigo-600 font-bold"> Object Detection using TensorFlow.js </span> <br />
            </h2>
            <div>
                <button onClick={toggleMode} style={styles.button}>
                    {isWebcam ? 'Switch to Image Upload' : 'Switch to Webcam'}
                </button>
            </div>
            <AiChatbot />
            {/* Image upload mode by default */}
            {!isWebcam && (
                <div style={styles.uploadContainer}>
                    <input type="file" accept="image/*" onChange={handleFileUpload} style={styles.fileInput} />
                    {imageSrc && (
                        <img
                            ref={imageRef}
                            src={imageSrc}
                            alt="Uploaded"
                            style={styles.imagePreview}
                        />
                    )}
                </div>
            )}

            {/* Webcam mode */}
            {isWebcam && (
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    style={styles.video}
                />
            )}

            <canvas
                ref={canvasRef}
                width="400"
                height="480"
                style={styles.canvas}
            />

            {/* Display detection results */}
            <div style={styles.resultContainer}>
                <h2 style={styles.resultHeader}>Detection Results:</h2>
                <pre style={styles.resultText}>{detectionResult || 'No objects detected.'}</pre>
            </div>
        </div>
    );
};

// Styling object for a better and more organized UI
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f8f8f8',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        maxWidth: '700px',
        margin: 'auto',
        position: 'relative' as 'relative',

    },
    button: {
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        fontSize: '1.2rem',
        cursor: 'pointer',
        borderRadius: '8px',
        transition: 'background-color 0.3s ease',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    uploadContainer: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center',
        marginBottom: '20px',
        width: '100%',
    },
    fileInput: {
        marginBottom: '15px',
        padding: '12px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        fontSize: '1rem',
        backgroundColor: '#fff',
        outline: 'none',
    },
    imagePreview: {
        width: '100%',
        maxWidth: '640px',
        maxHeight: '480px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    video: {
        width: '100%',
        maxWidth: '640px',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        marginBottom: '20px',  // Add space below the canvas

    },
    canvas: {
        marginTop: '200px',  // Increase this value to add more space
        position: 'absolute' as 'absolute',
        top: '0',
        left: '0',
        zIndex: 0, // Lower z-index to ensure it's below the button and input
        borderRadius: '12px',
        pointerEvents: 'none' as 'none', // Fix: ensure it's of type 'none'
        marginBottom: '20px',  // Add space below the canvas

    },
    resultContainer: {
        marginTop: '50px',  // Increase this value to add more space
        width: '100%',
        textAlign: 'center' as 'center',
        marginBottom: '20px',  // Add space below the canvas

    },
    resultHeader: {
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#333',
    },
    resultText: {
        fontFamily: 'Courier New, monospace',
        fontSize: '1rem',
        backgroundColor: '#f4f4f4',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        whiteSpace: 'pre-wrap' as 'pre-wrap',
        wordWrap: 'break-word' as 'break-word',
        color: '#333',
        marginTop: '15px',
    },
};

export default ObjectDetection;
