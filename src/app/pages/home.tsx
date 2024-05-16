import { Plus } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import BoardCard from '../../components/card/boardCard';
import { TerminalBoard } from '../../components/terminal/terminalBoard';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableRow } from '../../components/ui/table';
import { getRandomCards } from '../../lib/card';
import { AppContext } from '../../renderer/providers/app';
import useAccountStore from '../../store/accountStore';
import useGameStore from '../../store/gameStore';

export const HomePage: React.FC<any> = (cardDeck, setNumberOfCards) => {
  const [cards, setCards] = useState<number[][]>([
    // [
    //   [47, 28, 0, 16, 29, 40, 46, 19, 21, 2, 39, 44, 34],
    //   [6, 17, 8, 49, 33, 7, 51, 18, 30, 45, 36, 11, 13],
    //   [22, 26, 15, 14, 48, 23, 24, 41, 32, 38, 35, 42, 4],
    //   [5, 27, 3, 37, 9, 50, 12, 43, 20, 31, 1, 10, 25],
    // ],
  ]);
  const { state } = useContext(AppContext);
  const { crawledCards, isFoundedRoom } = useGameStore();

  useEffect(() => {
    if (isFoundedRoom && crawledCards.length === 0) {
      setCards((pre) => [...pre, []]);
    }
    if (isFoundedRoom && crawledCards.length > 1) {
      const mappedCard = crawledCards.map(
        (gameCard: { cs: any }) => gameCard.cs
      );

      let boBai: number[] = [];
      if (mappedCard.length === 4) {
        for (let i = 0; i < 13; i++) {
          boBai.push(mappedCard[0][i]);
          boBai.push(mappedCard[1][i]);
          boBai.push(mappedCard[2][i]);
          boBai.push(mappedCard[3][i]);
        }
        setCards((pre) => [...pre, boBai]);
      }
    }
  }, [crawledCards]);

  const addRandomCards = () => {
    // const mappedCard = [
    //   [47, 28, 0, 16, 29, 40, 46, 19, 21, 2, 39, 44, 34],
    //   [6, 17, 8, 49, 33, 7, 51, 18, 30, 45, 36, 11, 13],
    //   [22, 26, 15, 14, 48, 23, 24, 41, 32, 38, 35, 42, 4],
    //   [5, 27, 3, 37, 9, 50, 12, 43, 20, 31, 1, 10, 25],
    // ];
    // let boBai: number[] = [];
    // if (mappedCard.length === 4) {
    //   for (let i = 0; i < 13; i++) {
    //     boBai.push(mappedCard[0][i]);
    //     boBai.push(mappedCard[1][i]);
    //     boBai.push(mappedCard[2][i]);
    //     boBai.push(mappedCard[3][i]);
    //   }
    // }
    setCards((prevCards) => [...prevCards, getRandomCards()]);
    setCards((prevCards) => [...prevCards, getRandomCards()]);
  };

  const { accounts } = useAccountStore();

  return (
    <div className="relative h-screen">
      <main className="grid flex-1 gap-4 py-4 tablet:grid-cols-3 relative mt-[90px]">
        <Card
          className="tablet:col-span-2 text-center border"
          x-chunk="dashboard-03-chunk-0"
        >
          <CardHeader>
            <CardTitle>All card in room</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {cards.map((card, index) => (
                  <TableRow
                    key={index}
                    className={`relative !rounded-[20px] bg-opacity-60 `}
                  >
                    <BoardCard
                      cards={card}
                      indexProps={index}
                      numPlayers={cardDeck.cardDeck}
                      currentGame={state.currentGame}
                    />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          {process.env.NODE_ENV == 'development' && (
            <CardFooter>
              <div className="text-xs text-muted-foreground flex flex-row gap-2 items-center">
                <Label>
                  Showing <strong>{cards.length}</strong> of cards
                </Label>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={addRandomCards}
                >
                  <Plus />
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
        <div>
          <div className=" sticky top-[90px]">
            <Card className="w-full flex flex-col gap-4 border-0 ">
              {accounts['MAIN'].map(
                (main: any, index: any) =>
                  main.isSelected && <TerminalBoard key={index} main={main} />
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
