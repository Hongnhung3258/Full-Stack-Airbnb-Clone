import { Conversation, Message, User } from "@prisma/client";
import { create } from "zustand";
import { ActiveListStore } from "../hooks/useActiveList";

export type FullMessageType = Message & {
    sender: User,
    seen: User[]
};

export type FullConversationType = Conversation & {
    users: User[],
    messages: FullMessageType[],
};
export const useActiveList = create<ActiveListStore>((set) => ({
    members: [],
    add: (id) => set((state) => ({ members: [...state.members, id] })),
    remove: (id) => set((state) => ({ members: state.members.filter((memberId) => memberId !== id) })),
    set: (ids) => set({ members: ids })
}));
