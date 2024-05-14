import {
  Bot,
  Loader2,
  LogIn,
  SearchCheck,
  Settings,
  SquareMousePointer,
} from 'lucide-react';
import React, { useState } from 'react';
import { FindRoomSheet } from '../../components/menu/findSheet';
import HandType from '../../components/menu/handType';
import RoomType from '../../components/menu/roomType';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../components/ui/tooltip';
import useBotRoomStore from '../../store/botRoomStore';
import useGameStore from '../../store/gameStore';
import useSubRoomStore from '../../store/subRoomStore';

const RemoteBar: React.FC<any> = ({
  cardDeck,
  setCardDeck,
  setRefreshCardsKey,
  setIsOpenSheet,
}) => {
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
    isLogining,
    setIsLogining,
    setRoomType,
  } = useGameStore();
  const { clearAllStatesBot } = useBotRoomStore();
  const { clearAllStatesSub } = useSubRoomStore();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isOpenBotSheet, setIsOpenBotSheet] = useState(false);

  const onLogin = () => {
    setStartGameStatus(true);
    setIsLogining(true);
  };

  const onFindGame = () => {
    setMainCard([]);
    setFindingStatus(true);
    setReadyToCreateStatus(true);
    setRefreshCardsKey((prevKey: number) => prevKey + 1);
  };
  const onRefreshBot = () => {
    setRefreshKey((prevKey: number) => prevKey + 1);
  };
  const onCancelFind = () => {
    clearGameState();
    clearAllStatesBot();
    clearAllStatesSub();
    onRefreshBot();
  };
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
  const handleRoomTypeChange = (money: number) => {
    setRoomType(money);
  };
  return (
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
          {mainRoomID && (
            <div className="flex p-[10px] rounded-sm border">
              <Label className="">
                Room ID: <span className="">{mainRoomID}</span>
              </Label>
            </div>
          )}
          <HandType cardDeck={cardDeck} setCardDeck={setCardDeck} />
          <RoomType />
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
                disabled={isLogining}
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
  );
};

export default RemoteBar;
