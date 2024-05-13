import {
  Bot,
  ChevronDown,
  DollarSign,
  Hand,
  Loader,
  Loader2,
  LogIn,
  SearchCheck,
  Settings,
  SquareMousePointer,
} from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountSection } from '../components/account/accountSection';
import { FindRoomSheet } from '../components/menu/findSheet';
import MainSetting from '../components/menu/mainSetting';
import { useToast } from '../components/toast/use-toast';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../components/ui/tooltip';
import { roomTypes } from '../lib/config';
import { validateLicense } from '../lib/supabase';
import { isMatchCards } from '../lib/utils';
import { AppContext } from '../renderer/providers/app';
import useBotRoomStore from '../store/botRoomStore';
import useGameStore from '../store/gameStore';
import useSubRoomStore from '../store/subRoomStore';
import { HomePage } from './pages/home';

export function App() {
  const { state, setState } = useContext(AppContext);
  const {
    subCards,
    botCards,
    setFindingStatus,
    isStartGame,
    isFinding,
    setStartGameStatus,
    setReadyToCreateStatus,
    clearGameState,
    isFoundedRoom,
    setRoomFoundStatus,
    setFoundedRoom,
    mainRoomID,
    setMainCard,
    roomType,
    setRoomType,
  } = useGameStore();
  const { clearAllStatesBot } = useBotRoomStore();
  const { clearAllStatesSub, roomID } = useSubRoomStore();
  const [cardDeck, setCardDeck] = useState('4');
  const [loading, setLoading] = useState(false);
  const [isOpenSheet, setIsOpenSheet] = useState(false);
  const [isOpenBotSheet, setIsOpenBotSheet] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshCardsKey, setRefreshCardsKey] = useState(0);

  const onScrollToBoardCard = () => {
    const boardCardId = `boardCard-active`;
    const boardCardElement = document.getElementById(boardCardId);

    if (boardCardElement) {
      const yOffset = -190;
      const y =
        boardCardElement.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const onLogin = () => {
    setStartGameStatus(true);
  };

  const onFindGame = () => {
    setMainCard([]);
    setFindingStatus(true);
    setReadyToCreateStatus(true);
    setRefreshCardsKey((prevKey) => prevKey + 1);
  };
  const onRefreshBot = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };
  const onCancelFind = () => {
    clearGameState();
    clearAllStatesBot();
    clearAllStatesSub();
    onRefreshBot();
  };

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
    // else if (botCards.length == 4 && isFoundedRoom) {
    //   setCrawlCard(botCards);
    // }
  }, [subCards, botCards]);

  useEffect(() => {
    if (
      process.env.NODE_ENV != 'development' &&
      !localStorage.getItem('license-key')
    ) {
      validateLicense(setLoading, toast, navigate);
    }
  }, []);

  const handleRoomTypeChange = (money: number) => {
    setRoomType(money);
  };

  function formatCurrency(value: number) {
    const cash = value / 1000;
    return cash < 1 ? value : `${value} (${cash}k)`;
  }

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
              <div className="flex items-center fixed top-0 left-0 right-0  py-[15px] bg-background border-b z-[21] px-[10px]">
                <div className="ml-auto w-full flex items-center gap-2 justify-between">
                  <Button
                    onClick={() => setIsOpenBotSheet(true)}
                    size="sm"
                    className="h-8 gap-1"
                  >
                    <Bot />
                  </Button>
                  <div key={refreshKey}>
                    <FindRoomSheet
                      setIsOpen={setIsOpenBotSheet}
                      isOpen={isOpenBotSheet}
                    />
                  </div>

                  <div className="flex gap-2 items-center">
                    <div className="h-8 gap-1 flex flex-row justify-center items-center">
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        {state.targetAt && `Room: ${state.targetAt}`}
                      </span>
                    </div>
                    {mainRoomID && (
                      <div className="flex p-[10px] rounded-sm border">
                        <Label className="">
                          Room ID: <span className="">{mainRoomID}</span>
                        </Label>
                      </div>
                    )}
                    <RadioGroup
                      defaultValue={cardDeck}
                      onValueChange={(value) => {
                        setCardDeck(value);
                      }}
                      className="flex flex-row border py-[4px] px-[7px] rounded-[5px] items-center"
                    >
                      <Hand className="w-3.5 h-3.5" />
                      <div className="flex items-center space-x-2">
                        <div className="border p-0 px-[4px] rounded-full">
                          <RadioGroupItem
                            value="2"
                            id="option-two"
                            className=" border-white"
                          />
                        </div>
                        <Label>2</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="border p-0 px-[4px] rounded-full">
                          <RadioGroupItem value="3" id="option-three" />
                        </div>
                        <Label>3</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="border p-0 px-[4px] rounded-full">
                          <RadioGroupItem value="4" id="option-four" />
                        </div>
                        <Label>4</Label>
                      </div>
                    </RadioGroup>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 !border-[#fff]"
                        >
                          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            {formatCurrency(roomType)}
                          </span>
                          <DollarSign className="h-3.5 w-3.5" />
                          <ChevronDown />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Room Type</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {roomTypes.map((rType) => (
                          <DropdownMenuCheckboxItem
                            key={rType}
                            checked={state.initialRoom.roomType === rType}
                            onSelect={() => handleRoomTypeChange(rType)}
                          >
                            {formatCurrency(rType)}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex gap-2 items-center">
                    {!isStartGame ? (
                      <Button
                        onClick={onLogin}
                        size="sm"
                        className="h-8 gap-1 cursor-pointer hover:opacity-70"
                      >
                        <LogIn className="h-3.5 w-3.5" />
                        Login
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={onFindGame}
                          size="sm"
                          className="h-8 gap-1"
                          disabled={isFinding}
                        >
                          {isFinding ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin cursor-pointer hover:opacity-70" />
                          ) : (
                            <SearchCheck className="h-3.5 w-3.5" />
                          )}
                          Find room
                        </Button>
                        <Button
                          onClick={() => onCancelFind()}
                          size="sm"
                          className="h-8 gap-1 bg-yellow-500 cursor-pointer hover:opacity-70"
                        >
                          Cancel
                        </Button>
                      </>
                    )}

                    {/* <Tooltip>
                      <TooltipTrigger>
                        <div
                          style={{ fontFamily: 'monospace' }}
                          className="h-8 text-[19px] flex justify-center items-center px-[10px] rounded-sm bg-green-600"
                        >
                          <HandCardIcon /> {numberOfCards}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Number of cards crawled</p>
                      </TooltipContent>
                    </Tooltip> */}
                    <Tooltip>
                      <TooltipTrigger>
                        <div
                          onClick={() => onScrollToBoardCard()}
                          className="h-8 gap-1 bg-white flex justify-center items-center px-[10px] rounded-sm cursor-pointer hover:opacity-70"
                        >
                          <SquareMousePointer className="text-black" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Scroll to current game</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <div
                          onClick={() => setIsOpenSheet(true)}
                          className="h-8 gap-1 bg-white flex justify-center items-center px-[10px] rounded-sm cursor-pointer hover:opacity-70"
                        >
                          <Settings className="text-black" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Setting</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
              <HomePage key={refreshCardsKey} cardDeck={cardDeck} />
            </main>
          </div>
        )}
      </div>
      {/* </Tabs> */}
    </div>
  );
}
