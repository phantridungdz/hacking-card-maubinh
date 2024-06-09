import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import useAccountStore from '../store/accountStore';

const useBotRoomStore = create<any>(
  devtools(
    (set, get) => ({
      bots: [],
      botsInLobby: [],
      botsInRoom: [],
      roomID: null,
      botRoomStatus: 'Not-ready',
      botMoneyChange: 0,
      botsValid: [],
      botsReady: [],
      isReadyToJoin: false,
      isBotStart: false,
      addBot: (bot: any, role: string) =>
        set((state: { bots: any[] }) => ({
          bots: [...state.bots, { ...bot, role, status: 'idle' }],
        })),
      addBotValid: (fullname: string) =>
        set((state: { botsValid: string[]; bots: any[] }) => {
          const isAlreadyInBots = state.bots.some(
            (bot) => bot.username === fullname
          );
          return {
            botsValid: isAlreadyInBots
              ? state.botsValid
              : [...state.botsValid, fullname],
          };
        }),
      addBotReady: (botUsername: string) =>
        set((state: { botsReady: string[] }) => ({
          botsReady: state.botsReady.includes(botUsername)
            ? state.botsReady
            : [...state.botsReady, botUsername],
        })),

      removeBot: (botUsername: any) =>
        set((state: { bots: any[] }) => ({
          bots: state.bots.filter((bot) => bot.username !== botUsername),
        })),
      clearBotReady: () =>
        set(() => ({
          botsReady: [],
        })),
      clearBots: () => {
        const { bots } = get();
        const updateAccount = useAccountStore.getState().updateAccount;
        bots.forEach((bot: any) => {
          updateAccount('BOT', bot.username, { role: null });
        });
        set({ bots: [] });
      },
      setBots: (bots: any) =>
        set(() => ({
          bots: bots,
        })),
      updateBotsInLobby: (count: any) =>
        set(() => ({
          botsInLobby: count,
        })),

      updateBotsInRoom: (count: any) =>
        set(() => ({
          botsInRoom: count,
        })),

      updateRoomID: (id: any) =>
        set(() => ({
          roomID: id,
        })),

      updateStatus: (newStatus: any) =>
        set(() => ({
          botRoomStatus: newStatus,
        })),
      updateBotMoneyChange: (newMoneyChange: any) =>
        set(() => ({
          botMoneyChange: newMoneyChange,
        })),
      updateBotStatus: (botUsername: string, newStatus: string) =>
        set((state: { bots: any[] }) => ({
          bots: state.bots.map((bot) =>
            bot.username === botUsername ? { ...bot, status: newStatus } : bot
          ),
        })),
      setReadyToJoinStatus: (status: boolean) =>
        set(() => ({
          isReadyToJoin: status,
        })),
      setBotStart: (status: boolean) =>
        set(() => ({
          isBotStart: status,
        })),
      joinLobby: (botUsername: string) =>
        set(
          (state: {
            bots: any[];
            botsInLobby: string[];
            botsInRoom: string[];
          }) => ({
            botsInLobby: state.botsInRoom.includes(botUsername)
              ? state.botsInLobby
              : [...state.botsInLobby, botUsername],
            botsInRoom: state.botsInRoom.filter((name) => name !== botUsername),
            bots: state.bots.map((bot) =>
              bot.username === botUsername
                ? { ...bot, status: 'In lobby' }
                : bot
            ),
          })
        ),

      joinRoom: (botUsername: string) =>
        set(
          (state: {
            bots: any[];
            botsInLobby: string[];
            botsInRoom: string[];
          }) => ({
            botsInRoom: state.botsInLobby.includes(botUsername)
              ? [...state.botsInRoom, botUsername]
              : state.botsInRoom,
            botsInLobby: state.botsInLobby.filter(
              (name) => name !== botUsername
            ),
            bots: state.bots.map((bot) =>
              bot.username === botUsername ? { ...bot, status: 'In room' } : bot
            ),
          })
        ),
      outRoom: (botUsername: string) =>
        set(
          (state: {
            bots: any[];
            botsInLobby: string[];
            botsInRoom: string[];
          }) => ({
            botsInLobby: [...state.botsInLobby, botUsername],
            botsInRoom: state.botsInRoom.filter((name) => name !== botUsername),
            bots: state.bots.map((bot) =>
              bot.username === botUsername
                ? { ...bot, status: 'In lobby' }
                : bot
            ),
          })
        ),
      clearAllStatesBot: () =>
        set(() => ({
          botsInLobby: [],
          botsInRoom: [],
          roomID: null,
          botRoomStatus: 'Not-ready',
          botsValid: [],
          botsReady: [],
          isReadyToJoin: false,
        })),
    }),

    {
      name: 'botRoom-store',
    }
  )
);

export default useBotRoomStore;
