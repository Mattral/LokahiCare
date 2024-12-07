"use client"
declare var ml5: any;
import React, { useState, useEffect, useRef } from 'react';

const ImageClassifier: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<HTMLImageElement[]>([]);
  const [message, setMessage] = useState<string>('Upload images');
  const [label, setLabel] = useState<string>('');
  const [featureExtractor, setFeatureExtractor] = useState<any | null>(null);
  const [classifier, setClassifier] = useState<any | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [isPredictionAvailable, setIsPredictionAvailable] = useState<boolean>(false);

  // Refs for the DOM elements that need to be manipulated
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const trainButtonRef = useRef<HTMLButtonElement>(null);
  const predictButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Initialize the model when the component mounts
    const featureExtractorInstance = ml5.featureExtractor('MobileNet', modelLoaded);
    const classifierInstance = featureExtractorInstance.classification();
    setFeatureExtractor(featureExtractorInstance);
    setClassifier(classifierInstance);

    function modelLoaded() {
      setMessage('Model loaded. You can now add images and train.');
      setIsModelLoaded(true);
    }
  }, []);

  const loadImgFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    setMessage('Uploading images...');
    setUploadedImages([]);
    const files = Array.from(event.target.files);

    if (files.length === 0) {
      setMessage('No files selected. Please upload images.');
      return;
    }

    const images: HTMLImageElement[] = [];
    files.forEach((file) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        images.push(img);
        if (images.length === files.length) {
          setUploadedImages(images);
          setMessage(`${files.length} image(s) uploaded. You can now add labels and train.`);
        }
      };
    });
  };

  const addImages = () => {
    if (label.trim() === '') {
      alert('Please enter a label');
      return;
    }
    uploadedImages.forEach((img) => {
      classifier?.addImage(img, label);
    });
    setMessage(`Added ${uploadedImages.length} image(s) with label: ${label}`);
    setIsTraining(true);
  };

  const trainModel = () => {
    setMessage('Training model...');
    setIsTraining(true);
    classifier?.train((lossValue: any) => {
      if (lossValue) {
        setMessage(`Training... Loss: ${lossValue}`);
      } else {
        setMessage('Training complete!');
        setIsPredictionAvailable(true);
      }
    });
  };

  const predict = () => {
    if (uploadedImages.length === 0) {
      setMessage('Please upload an image to predict.');
      return;
    }
    classifier?.classify(uploadedImages[0], (err: any, results: any) => {
      if (err) {
        console.error(err);
        setMessage('Error during prediction.');
      } else {
        setMessage(`Prediction: ${results[0].label} (${results[0].confidence.toFixed(2)})`);
      }
    });
  };

  return (
    <div>
      <h1>Mini Teachable Machine</h1>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={loadImgFiles}
        ref={fileInputRef}
      />
      <div
        ref={imageContainerRef}
        style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}
      >
        {uploadedImages.map((img, index) => (
          <img key={index} src={img.src} alt={`uploaded ${index}`} width={200} />
        ))}
      </div>
      <p>{message}</p>
      <input
        type="text"
        placeholder="Enter label"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />
      <button
        onClick={addImages}
        disabled={!isModelLoaded || uploadedImages.length === 0}
        ref={addButtonRef}
      >
        Add Images
      </button>
      <button
        onClick={trainModel}
        disabled={!isModelLoaded || uploadedImages.length === 0 || !isTraining}
        ref={trainButtonRef}
      >
        Train Model
      </button>
      <button
        onClick={predict}
        disabled={!isPredictionAvailable || uploadedImages.length === 0}
        ref={predictButtonRef}
      >
        Predict
      </button>
    </div>
  );
};

export default ImageClassifier;
