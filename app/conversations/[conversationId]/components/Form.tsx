"use client";

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import {
    FieldValues,
    SubmitHandler,
    useForm
} from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import { CldUploadButton } from "next-cloudinary";
import { FaMicrophone } from 'react-icons/fa';

import MessageInput from "./MessageInput";
import { useState } from "react";

const Form = () => {
    const { conversationId } = useConversation();

    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

    const {
        register,
        handleSubmit,
        setValue,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            message: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setValue('message','', { shouldValidate: true });

        axios.post('/api/messages', {
            ...data,
            conversationId
        })
    };

    const handleUpload = (result: any) => {
        console.log(result); // Debug để xem kết quả trả về từ Cloudinary
        axios.post('/api/messages', {
            image: result?.info?.secure_url,
            conversationId
        })
    };

    const handleRecord = () => {
        if (isRecording) {
            // Dừng ghi âm
            mediaRecorder?.stop();
        } else {
            // Bắt đầu ghi âm
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    const recorder = new MediaRecorder(stream);
                    setMediaRecorder(recorder);
                    recorder.start();
                    setIsRecording(true);

                    // Lưu lại dữ liệu âm thanh
                    const chunks: Blob[] = [];
                    recorder.ondataavailable = e => chunks.push(e.data);
                    setAudioChunks(chunks);

                    recorder.onstop = () => {
                        setIsRecording(false);
                        const audioBlob = new Blob(chunks, { type: 'audio/mp3' });
                        const formData = new FormData();
                        formData.append('file', audioBlob, 'recording.mp3');
                        
                        // Gửi file ghi âm
                        axios.post('/api/messages', {
                            audio: URL.createObjectURL(audioBlob),
                            conversationId
                        }).then(() => {
                            console.log("Audio sent!");
                        });
                    };
                });
        }
    };

    return (
        <div
            className="
                py-4
                px-4
                bg-white
                border-t
                flex
                items-center
                gap-2
                lg:gap-4
                w-full
            "
        >
            <CldUploadButton
                options={{ maxFiles: 1 }}
                onUpload={handleUpload}
                uploadPreset="q1ypbjul"
            >
                 <HiPhoto size={30} className="text-sky-500" />
            </CldUploadButton>
           
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex items-center gap-2 lg:gap-4 w-full"
            >
                <MessageInput
                    id="message"
                    register={register}
                    errors={errors}
                    required
                    placeholder="Write a message"
                />
                <button
                    onClick={handleRecord}
                    className={`
                        rounded-full
                        p-2
                        ${isRecording ? 'bg-red-500' : 'bg-gray-300'}
                        cursor-pointer
                        hover:bg-red-600
                        transition
                    `}
                    title="Record Audio"
                >
                    <FaMicrophone 
                        size={18} 
                        className="text-white" 
                    />
                </button>

                <button
                    type="submit"
                    className="
                        rounded-full
                        p-2
                        bg-sky-500
                        cursor-pointer
                        hover:bg-sky-600
                        transition
                    "
                >
                    <HiPaperAirplane 
                        size={18}
                        className="text-white"
                    />
                </button>
            </form>
        </div>
    );
}

export default Form;
