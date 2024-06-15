import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountSection } from '../components/account/accountSection';

import MainSetting from '../components/menu/mainSetting';
import RemoteBar from '../components/menu/remoteBar';
import { useToast } from '../components/toast/use-toast';
import { isMatchCards } from '../lib/utils';
import useGameStore from '../store/gameStore';
import useSubRoomStore from '../store/subRoomStore';
import { HomePage } from './pages/Home';

export function App() {
  const {
    subCards,
    botCards,
    isFoundedRoom,
    setRoomFoundStatus,
    setFoundedRoom,
  } = useGameStore();
  const { roomID } = useSubRoomStore();
  const [cardDeck, setCardDeck] = useState('4');
  const [loading, setLoading] = useState(false);
  const [isOpenSheet, setIsOpenSheet] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const [refreshCardsKey, setRefreshCardsKey] = useState(0);

  useEffect(() => {
    if (subCards.length == 2 && botCards.length == 2 && !isFoundedRoom) {
      botCards.map((botCard: any) => {
        if (isMatchCards(botCard, subCards[0])) {
          setRoomFoundStatus(true);
          setFoundedRoom(roomID.toString());
          toast({
            title: 'Matched Room',
            description: `Founded room !`,
          });
        } else {
          toast({
            title: 'Not match',
            description: `Find again !`,
          });
        }
      });
    }
  }, [subCards, botCards]);

  useEffect(() => {
    if (!localStorage.getItem('license-key')) {
      navigate('/');
    }
  }, []);

  return (
    <div className="h-screen">
      <MainSetting setIsOpen={setIsOpenSheet} isOpen={isOpenSheet}>
        <AccountSection accountType="MAIN" />
        <AccountSection accountType="BOT" />
        <AccountSection accountType="SUB" />
      </MainSetting>
      <div className="flex w-full flex-col">
        {loading ? (
          <div className="h-screen w-full flex justify-center items-center">
            <Loader className="w-6.5 h-6.5 animate-spin"></Loader>
          </div>
        ) : (
          <div className="flex flex-col sm:gap-4">
            <main className="grid flex-1 items-start gap-4 bg-background sm:px-6 sm:py-0 md:gap-8 ">
              <RemoteBar
                cardDeck={cardDeck}
                setCardDeck={setCardDeck}
                setRefreshCardsKey={setRefreshCardsKey}
                setIsOpenSheet={setIsOpenSheet}
              />
              <HomePage
                key={refreshCardsKey}
                cardDeck={cardDeck}
                setCardDeck={setCardDeck}
              />
            </main>
          </div>
        )}
      </div>
      {/* </Tabs> */}
    </div>
  );
}
