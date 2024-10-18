import { useState } from 'react';
import { FaMicrophone } from 'react-icons/fa';

const Recorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    
    recorder.start();
    setIsRecording(true);
    setMediaRecorder(recorder);

    recorder.ondataavailable = (e) => {
      const audioURL = URL.createObjectURL(e.data);
      console.log("Audio recorded:", audioURL);
      // Bạn có thể gửi hoặc phát lại âm thanh ở đây
    };
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div>
      {isRecording ? (
        <button onClick={stopRecording} title="Stop Recording">
          <FaMicrophone />
        </button>
      ) : (
        <button onClick={startRecording} title="Start Recording">
          <FaMicrophone />
        </button>
      )}
    </div>
  );
};

export default Recorder;
