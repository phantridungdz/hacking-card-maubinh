import create from 'zustand';
import { devtools } from 'zustand/middleware';

const useGameStore = create<any>(
  devtools(
    (set) => ({
      subCards: [],
      botCards: [],
      crawledCards: [],
      isFoundedRoom: false,
      isStartGame: false,
      isReadyToFind: false,
      isReadyToCreate: false,
      isFinding: false,
      roomsReady: 0,
      mainRoomID: null,
      isMainJoin: false,
      mainCard: [],
      addCard: (type: 'subCards' | 'botCards', card: any) =>
        set((state: { [x: string]: any[] }) => ({
          [type]: [...state[type], card],
        })),
      addCrawlCard: (card: any) =>
        set((state: any) => ({
          crawledCards: [...state.crawledCards, card],
        })),
      setCrawlCard: (card: any) =>
        set(() => ({
          crawledCards: card,
        })),

      removeSubCard: () =>
        set(() => ({
          subCards: [],
        })),
      removeBotCard: () =>
        set(() => ({
          botCards: [],
        })),

      clearCards: () =>
        set(() => ({
          subCards: [],
          botCards: [],
        })),
      setMainCard: (card: boolean) =>
        set(() => ({
          mainCard: card,
        })),
      setRoomFoundStatus: (status: boolean) =>
        set(() => ({
          isFoundedRoom: status,
        })),
      setStartGameStatus: (status: boolean) =>
        set(() => ({
          isStartGame: status,
        })),
      setReadyToFindStatus: (status: boolean) =>
        set(() => ({
          isReadyToFind: status,
        })),
      setReadyToCreateStatus: (status: boolean) =>
        set(() => ({
          isReadyToCreate: status,
        })),
      setFindingStatus: (status: boolean) =>
        set(() => ({
          isFinding: status,
        })),
      setFoundedRoom: (status: boolean) =>
        set(() => ({
          mainRoomID: status,
        })),
      setMainJoinStatus: (status: boolean) =>
        set(() => ({
          isMainJoin: status,
        })),
      incrementRoomsReady: () =>
        set((state: { roomsReady: number }) => ({
          roomsReady: state.roomsReady + 1,
        })),

      decrementRoomsReady: () =>
        set((state: { roomsReady: number }) => ({
          roomsReady: state.roomsReady - 1,
        })),
      clearGameState: () =>
        set(() => ({
          subCards: [],
          botCards: [],
          isFoundedRoom: false,
          isStartGame: false,
          isReadyToFind: false,
          isReadyToCreate: false,
          isFinding: false,
          roomsReady: 0,
          mainRoomID: null,
          isMainJoin: false,
        })),
    }),
    {
      name: 'game-store',
    }
  )
);

export default useGameStore;
