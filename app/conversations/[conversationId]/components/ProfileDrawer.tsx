"use client";

import useOtherUser from "@/app/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import { Fragment, useMemo, useState } from "react";
import { format } from "date-fns";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose, IoTrash, IoCall, IoVideocam, IoNotificationsOff, IoSearch, IoPersonAdd, IoBan  } from "react-icons/io5";
import Avatar from "@/app/components/Avatar";
import ConfirmModal from "./ConfirmModal";
import AvatarGroup from "@/app/components/AvatarGroup";
import useActiveList from "@/app/hooks/useActiveList";
import axios from "axios";

interface ProfileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    data: Conversation & {
        users: User[]
    }
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
    isOpen,
    onClose,
    data
}) => {
    const otherUser = useOtherUser(data);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [nickname, setNickname] = useState('');
    const [searchText, setSearchText] = useState('');

    const { members } = useActiveList();
    const isActive = members.indexOf(otherUser?.email!) !== -1;

    const joinedDate = useMemo(() => {
        return format(new Date(otherUser.createdAt), 'PP');
    }, [otherUser.createdAt]);

    const title = useMemo(() => {
        return data.name || otherUser.name;
    }, [data.name, otherUser.name]);

    const statusText = useMemo(() => {
        if (data.isGroup) {
            return `${data.users.length} members`;
        }

        return isActive ? 'Active' : 'Offline';
    }, [data, isActive]);

    const saveNickname = () => {
        axios.post('/api/save-nickname', {
            conversationId: data.id,
            nickname
        }).then(() => {
            setIsEditing(false); // Tắt chế độ chỉnh sửa
        }).catch(() => {
            alert("Error saving nickname");
        });
    };

    return (
        <>
            <ConfirmModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
            />

            <Transition.Root show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={onClose}>
                    <Transition.Child 
                        as={Fragment}
                        enter="ease-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"                
                    >
                    <div 
                        className="
                            fixed
                            inset-0
                            bg-black
                            bg-opacity-40
                        "
                    />
                    </Transition.Child>

                    <div
                        className="
                            fixed
                            inset-0
                            overflow-hidden
                        "
                    >
                        <div
                            className="
                                absolute
                                inset-0
                                overflow-hidden
                            "
                        >
                            <div className="
                                pointer-events-none
                                fixed
                                inset-y-0
                                right-0
                                flex
                                max-w-full
                                pl-10
                            ">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-500"
                                    enterFrom="translate-x-ful"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-500"
                                    leaveTo="translate-x-full"
                                >
                                    <Dialog.Panel
                                        className="
                                            pointer-events-auto
                                            w-screen
                                            max-w-md
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                h-full
                                                flex-col
                                                overflow-y-scroll
                                                bg-white
                                                py-6
                                                shadow-xl
                                            "
                                        >
                                            <div className="px-4 sm:px-6">
                                                <div
                                                    className="
                                                        flex
                                                        items-start
                                                        justify-end
                                                    "
                                                >
                                                    <div
                                                    className="
                                                        ml-3
                                                        flex
                                                        h-7
                                                        items-center
                                                    "
                                                    >
                                                        <button
                                                            onClick={onClose}
                                                            type="button"
                                                            className="
                                                                rounded-md
                                                                bg-white
                                                                text-gray-400
                                                                hover:text-gray-500
                                                                focus:outline-none
                                                                focus:ring-2
                                                                focus:ring-sky-500
                                                                focus:ring-offset-2
                                                            "
                                                        >
                                                            <span className="sr-only">Close panel</span>
                                                            <IoClose size={24} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="
                                                relative mt-6
                                                flex-1 px-4
                                                sm:px-6
                                            ">
                                                <div className="
                                                    flex flex-col items-center
                                                ">
                                                    <div className="mb-2">
                                                        {data.isGroup ? (
                                                            <AvatarGroup users={data.users} />
                                                        ) : (
                                                            <Avatar user={otherUser} />
                                                        )}
                                                        
                                                    </div>
                                                    <div>
                                                        {title}
                                                    </div>
                                                    <div className="
                                                        text-sm text-gray-500
                                                    ">
                                                        {statusText}
                                                    </div>

                                                    <div className="flex gap-10 my-8">
                                                        <div
                                                            className="
                                                                flex
                                                                flex-col
                                                                gap-3
                                                                items-center
                                                                cursor-pointer
                                                                hover:opacity-75                                                    "
                                                            title="Voice Call"
                                                        >
                                                            <div
                                                                className="
                                                                    w-10
                                                                    h-10
                                                                    bg-neutral-100
                                                                    rounded-full
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                "
                                                            >
                                                                <IoCall size={20} />
                                                            </div>
                                                            <div
                                                                className="
                                                                    text-sm
                                                                    font-light
                                                                    text-neutral-600
                                                                "
                                                            >
                                                                Call
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="
                                                                flex
                                                                flex-col
                                                                gap-3
                                                                items-center
                                                                cursor-pointer
                                                                hover:opacity-75                                                    "
                                                            title="Video Call"
                                                        >
                                                            <div
                                                                className="
                                                                    w-10
                                                                    h-10
                                                                    bg-neutral-100
                                                                    rounded-full
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                "
                                                            >
                                                                <IoVideocam size={20} />
                                                            </div>
                                                            <div
                                                                className="
                                                                    text-sm
                                                                    font-light
                                                                    text-neutral-600
                                                                "
                                                            >
                                                                Video
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="
                                                                flex
                                                                flex-col
                                                                gap-3
                                                                items-center
                                                                cursor-pointer
                                                                hover:opacity-75                                                    "
                                                            title="Mute Notifications"
                                                        >
                                                            <div
                                                                className="
                                                                    w-10
                                                                    h-10
                                                                    bg-neutral-100
                                                                    rounded-full
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                "
                                                            >
                                                                <IoNotificationsOff size={20} />
                                                            </div>
                                                            <div
                                                                className="
                                                                    text-sm
                                                                    font-light
                                                                    text-neutral-600
                                                                "
                                                            >
                                                                Mute
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="w-full px-4 mt-6 sm:px-6 border-t border-gray-200">
                                                        {/* Đặt biệt danh */}
                                                        <div className="flex justify-between items-center w-full text-sm text-gray-500 py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                                                            <span className="text-gray-900">
                                                                Set Nickname
                                                            </span>
                                                            <IoPersonAdd size={20} className="text-gray-400" onClick={() => setIsEditing(true)} />
                                                        </div>

                                                        {/* Tìm kiếm tin nhắn */}
                                                        <div className="flex justify-between items-center w-full text-sm text-gray-500 py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                                                            <span className="text-gray-900">
                                                                Search Messages
                                                            </span>
                                                            <IoSearch size={20} className="text-gray-400" />
                                                        </div>

                                                        {/* Chặn người dùng */}
                                                        <div className="flex justify-between items-center w-full text-sm text-gray-500 py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                                                            <span className="text-gray-900">
                                                                Block User
                                                            </span>
                                                            <IoBan size={20} className="text-gray-400" />
                                                        </div>
                                                    </div>


                                                    
                                                    <div
                                                        className="
                                                            w-full
                                                            pb-5
                                                            pt-5
                                                            sm:px-0
                                                            sm:pt-0
                                                        "
                                                    >
                                                        <dl
                                                            className="
                                                                space-y-8
                                                                px-4
                                                                sm:space-y-6
                                                                sm:px-6
                                                            "
                                                        >
                                                            {data.isGroup && (
                                                                <div>
                                                                    <dt
                                                                        className="
                                                                            text-sm
                                                                            font-medium
                                                                            text-gray-500
                                                                            sm:w-40
                                                                            sm:flex-shrink-0
                                                                        "
                                                                    >
                                                                        Emails
                                                                    </dt>
                                                                    <dd
                                                                        className="
                                                                            mt-1
                                                                            text-sm
                                                                            text-gray-900
                                                                            sm:col-span-2
                                                                        "
                                                                    >
                                                                        {data.users.map((user) => user.email).join(', ')}
                                                                    </dd>
                                                                </div>
                                                            )}
                                                            {!data.isGroup && (
                                                                <div>
                                                                    <dl
                                                                        className="
                                                                            text-sm
                                                                            font-medium
                                                                            text-gray-500
                                                                            sm:w-40
                                                                            sm:flex-shrink-0
                                                                        "
                                                                    >
                                                                        Email
                                                                    </dl>
                                                                    <dd
                                                                        className="
                                                                            mt-1
                                                                            text-sm
                                                                            text-gray-900
                                                                            sm:col-span-2
                                                                        "
                                                                    >
                                                                        {otherUser.email}
                                                                    </dd>
                                                                </div>
                                                            )}
                                                            {!data.isGroup && (
                                                                <>
                                                                    <hr />
                                                                    <div>
                                                                        <dt
                                                                            className="
                                                                                text-sm
                                                                                font-medium
                                                                                text-gray-500
                                                                                sm:w-40
                                                                                sm:flex-shrink-0
                                                                            "
                                                                        >
                                                                            Joined
                                                                        </dt>
                                                                        <dd
                                                                            className="
                                                                                mt-1
                                                                                text-sm
                                                                                text-gray-900
                                                                                sm:col-span-2
                                                                            "
                                                                        >
                                                                            <time dateTime={joinedDate}>
                                                                                {joinedDate}
                                                                            </time>
                                                                        </dd>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </dl>
                                                    </div>

                                                    <div className="flex gap-10 my-8">
                                                        <div
                                                            onClick={() => setConfirmOpen(true)}
                                                            className="
                                                                flex
                                                                flex-col
                                                                gap-3
                                                                items-center
                                                                cursor-pointer
                                                                hover:opacity-75                                                    "
                                                        >
                                                            <div
                                                                className="
                                                                    w-10
                                                                    h-10
                                                                    bg-neutral-100
                                                                    rounded-full
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                "
                                                            >
                                                                <IoTrash size={20} />
                                                            </div>
                                                            <div
                                                                className="
                                                                    text-sm
                                                                    font-light
                                                                    text-neutral-600
                                                                "
                                                            >
                                                                Delete
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
       
    );
}

export default ProfileDrawer;