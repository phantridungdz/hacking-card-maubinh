import create from 'zustand';
import { devtools } from 'zustand/middleware';

const useSubRoomStore = create<any>(
  devtools(
    (set) => ({
      subs: [],
      subsInLobby: [],
      subsInRoom: [],
      roomID: null,
      subRoomStatus: 'Not-ready',
      subsValid: [],
      isReadyToJoin: false,
      isSubStart: false,
      addSub: (sub: any, role: string) =>
        set((state: { subs: any[] }) => ({
          subs: [...state.subs, { ...sub, role, status: 'idle' }],
        })),
      addSubValid: (fullname: string) =>
        set((state: { subsValid: string[] }) => ({
          subsValid: [...state.subsValid, fullname],
        })),

      removeSub: (subUsername: any) =>
        set((state: { subs: any[] }) => ({
          subs: state.subs.filter((sub) => sub.username !== subUsername),
        })),

      updateSubsInLobby: (count: any) =>
        set(() => ({
          subsInLobby: count,
        })),

      updateSubsInRoom: (count: any) =>
        set(() => ({
          subsInRoom: count,
        })),

      updateRoomID: (id: any) =>
        set(() => ({
          roomID: id,
        })),

      updateStatus: (newStatus: any) =>
        set(() => ({
          subRoomStatus: newStatus,
        })),
      updateSubStatus: (subUsername: string, newStatus: string) =>
        set((state: { subs: any[] }) => ({
          subs: state.subs.map((sub) =>
            sub.username === subUsername ? { ...sub, status: newStatus } : sub
          ),
        })),
      setReadyToJoinStatus: (status: boolean) =>
        set(() => ({
          isReadyToJoin: status,
        })),
      setSubStart: (status: boolean) =>
        set(() => ({
          isSubStart: status,
        })),
      joinLobby: (subUsername: string) =>
        set(
          (state: {
            subs: any[];
            subsInLobby: string[];
            subsInRoom: string[];
          }) => ({
            subsInLobby: state.subsInRoom.includes(subUsername)
              ? state.subsInLobby
              : [...state.subsInLobby, subUsername],
            subsInRoom: state.subsInRoom.filter((name) => name !== subUsername),
            subs: state.subs.map((sub) =>
              sub.username === subUsername
                ? { ...sub, status: 'In lobby' }
                : sub
            ),
          })
        ),

      joinRoom: (subUsername: string) =>
        set(
          (state: {
            subs: any[];
            subsInLobby: string[];
            subsInRoom: string[];
          }) => ({
            subsInRoom: state.subsInLobby.includes(subUsername)
              ? [...state.subsInRoom, subUsername]
              : state.subsInRoom,
            subsInLobby: state.subsInLobby.filter(
              (name) => name !== subUsername
            ),
            subs: state.subs.map((sub) =>
              sub.username === subUsername ? { ...sub, status: 'In room' } : sub
            ),
          })
        ),
      outRoom: (subUsername: string) =>
        set(
          (state: {
            subs: any[];
            subsInLobby: string[];
            subsInRoom: string[];
          }) => ({
            subsInLobby: [...state.subsInLobby, subUsername],
            subsInRoom: state.subsInRoom.filter((name) => name !== subUsername),
            subs: state.subs.map((sub) =>
              sub.username === subUsername
                ? { ...sub, status: 'In lobby' }
                : sub
            ),
          })
        ),
      clearAllStatesSub: () =>
        set(() => ({
          subsInLobby: [],
          subsInRoom: [],
          roomID: null,
          subRoomStatus: 'Not-ready',
          subsValid: [],
          isReadyToJoin: false,
        })),
    }),

    {
      name: 'subRoom-store',
    }
  )
);

export default useSubRoomStore;
