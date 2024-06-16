import {
  Bot,
  Expand,
  Loader2,
  LogIn,
  Moon,
  RefreshCcwDot,
  SearchCheck,
  Settings,
  SquareMousePointer,
  Sun,
} from 'lucide-react';
import React, { useState } from 'react';
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
import CreateAccount from '../model/createAccount';
import { useTheme } from '../provider/theme-provider';
import { FindRoomSheet } from '../sheet/findSheet';
import { Toggle } from '../ui/toggle';
import CardType from './cardType';
import TargetSite from './targetSite';

const RemoteBar: React.FC<any> = ({
  cardDeck,
  setCardDeck,
  setRefreshCardsKey,
  setIsOpenSheet,
}) => {
  const {
    setFindingStatus,
    isStartGame,
    isFinding,
    setStartGameStatus,
    setReadyToCreateStatus,
    clearGameState,
    mainRoomID,
    setMainCard,
    isLogining,
    setIsLogining,
    setFoundedRoom,
    setFlexCard,
    flexCard,
  } = useGameStore();
  const { clearAllStatesBot } = useBotRoomStore();
  const { clearAllStatesSub } = useSubRoomStore();

  const [refreshKey, setRefreshKey] = useState(0);
  const [isOpenBotSheet, setIsOpenBotSheet] = useState(false);
  const [isOpenCreateAccount, setIsOpenCreateAccount] = useState(false);
  const { theme, setTheme } = useTheme();

  const onLogin = async () => {
    await onRefreshBot();
    setStartGameStatus(true);
    setIsLogining(true);
  };

  const onFindGame = () => {
    setFoundedRoom(null);
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
  return (
    <div className="flex items-center fixed top-0 left-0 right-0  py-[15px] bg-background border-b z-[21] px-[10px]">
      <div className="ml-auto w-full flex items-center gap-2 justify-between">
        <div className="flex justify-start items-center gap-2">
          <Button
            onClick={() => setIsOpenBotSheet(true)}
            size="sm"
            className="h-8 gap-1"
          >
            <Bot />
          </Button>
        </div>
        <div key={refreshKey}>
          <FindRoomSheet
            setIsOpen={setIsOpenBotSheet}
            isOpen={isOpenBotSheet}
            onRefreshBot={onRefreshBot}
          />
        </div>

        <div className="flex gap-2 items-center  flex-nowrap">
          {mainRoomID && (
            <div className="p-[10px] rounded-sm border inline-block">
              <Label className="flex flex-row">Room ID: {mainRoomID}</Label>
            </div>
          )}
          <TargetSite />
          <HandType cardDeck={cardDeck} setCardDeck={setCardDeck} />
          <RoomType />
          <CardType />
          <div className="flex flex-row gap-1 items-center">
            <Button variant="ghost" size="icon" type="button">
              {theme === 'light' ? (
                <Moon onClick={() => setTheme('dark')} />
              ) : (
                <Sun onClick={() => setTheme('light')} />
              )}
            </Button>
          </div>
          <div className="rounded-[5px] flex justify-center items-center border cursor-pointer">
            <Toggle
              pressed={flexCard}
              onPressedChange={setFlexCard}
              className="p-[5px]"
            >
              <Expand className="h-3.5 w-3.5" />
            </Toggle>
          </div>
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
                onClick={() => window.location.reload()}
                className="h-8 gap-1 bg-white flex justify-center items-center px-[10px] rounded-sm cursor-pointer hover:opacity-70"
              >
                <RefreshCcwDot className="text-black" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reload app</p>
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
      <CreateAccount
        isOpenCreateAccount={isOpenCreateAccount}
        setIsOpenCreateAccount={setIsOpenCreateAccount}
      />
    </div>
  );
};

export default RemoteBar;
