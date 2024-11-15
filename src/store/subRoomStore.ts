import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import useAccountStore from '../store/accountStore';

const useSubRoomStore = create<any>(
  devtools(
    (set, get) => ({
      subs: [],
      subsInLobby: [],
      subsInRoom: [],
      roomID: null,
      subRoomStatus: 'Not-ready',
      subMoneyChange: 0,
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
      clearSubs: () => {
        const { subs } = get();
        const updateAccount = useAccountStore.getState().updateAccount;

        subs.forEach((sub: any) => {
          updateAccount('SUB', sub.username, { role: null });
        });

        set({ subs: [] });
      },
      setSubs: (subs: any) =>
        set(() => ({
          subs: subs,
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
      updateSubMoneyChange: (newMoneyChange: any) =>
        set(() => ({
          subMoneyChange: newMoneyChange,
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
