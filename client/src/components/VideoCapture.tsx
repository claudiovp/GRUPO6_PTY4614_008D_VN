'use client';

import { useEffect, useRef, useState } from 'react';
import { useRecording } from '@/context/RecordingContext';
import { FiCameraOff } from "react-icons/fi";
import { toast } from 'react-toastify';

const VideoCapture: React.FC = () => {
  const { isRecording } = useRecording();
  const videoRef = useRef<HTMLImageElement | null>(null);
  const [streamError, setStreamError] = useState(false); // Para gestionar el error de conexión al stream

  useEffect(() => {
    if (isRecording && videoRef.current) {
      // Se establece el estado de error en falso para cada inicialización de la grabación
      setStreamError(false);

      // Establece la URL de la transmisión de video desde el backend
      videoRef.current.src = 'http://localhost:5000/flaskStream';
      
      // Verifica si hay un error al cargar el stream
      videoRef.current.onerror = () => {
        setStreamError(true);
      };
    } else if (videoRef.current) {
      // Si la grabación se detiene, limpia el stream
      videoRef.current.src = '';
      setStreamError(false);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.onerror = null;
      }
    };
  }, [isRecording]);

  useEffect(() => {
    if (isRecording && streamError) {
      // Solo muestra el toast si está grabando y hay un error en la conexión
      toast.error('Error: No se pudo conectar con el stream de video.');
    }
  }, [isRecording, streamError]);

  return (
    <>
      {!isRecording && (
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-gray-800 bg-opacity-80">
          <FiCameraOff size={64} className="text-white" />
          <p className="text-white mt-4">No hay video en este momento</p>
        </div>
      )}
      {/* Contenedor de video */}
      <div className="flex h-full w-full">
        <img ref={videoRef} className="bg-gray-700 w-full h-auto" />
      </div>
    </>
  );
};

export default VideoCapture;
