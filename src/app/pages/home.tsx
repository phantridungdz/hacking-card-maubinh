import { useContext, useEffect, useState } from 'react';
import BoardCard from '../../components/card/boardCard';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { AppContext } from '../../renderer/providers/app';

export const HomePage: React.FC<any> = (cardDeck) => {
  const [cards, setCards] = useState<number[][]>([
    [
      44, 43, 14, 11, 47, 49, 13, 10, 41, 6, 51, 45, 21, 16, 19, 22, 30, 20, 3,
      2, 36, 32, 12, 50, 33, 7, 25, 1, 23, 35, 28, 29, 40, 34, 24, 39, 9, 46,
      17, 18, 27, 5, 37, 42, 0, 26, 38, 15, 8, 4, 31, 48,
    ],
    [
      46, 10, 34, 7, 0, 28, 1, 36, 51, 38, 27, 12, 26, 30, 9, 22, 37, 18, 44,
      33, 40, 8, 29, 13, 48, 5, 35, 41, 32, 6, 3, 50, 14, 42, 25, 39, 15, 45,
      49, 2, 24, 17, 4, 16, 11, 47, 19, 20, 23, 43, 31, 21,
    ],
    [
      51, 45, 36, 43, 8, 34, 10, 49, 27, 33, 35, 9, 32, 30, 7, 5, 23, 50, 41,
      21, 24, 17, 4, 26, 18, 29, 28, 46, 42, 15, 38, 12, 6, 1, 37, 39, 20, 40,
      16, 11, 14, 13, 25, 2, 3, 31, 48, 22, 0, 47, 19, 44,
    ],
    [
      28, 25, 31, 15, 9, 38, 36, 37, 50, 29, 41, 44, 2, 7, 26, 17, 11, 19, 5,
      47, 39, 14, 1, 20, 48, 43, 3, 32, 4, 23, 21, 30, 22, 24, 40, 6, 33, 8, 12,
      13, 18, 34, 35, 45, 0, 49, 51, 27, 42, 10, 16, 46,
    ],
    [
      44, 14, 45, 3, 4, 35, 39, 24, 23, 43, 22, 15, 30, 18, 29, 38, 5, 16, 42,
      6, 17, 46, 25, 51, 49, 8, 36, 2, 10, 12, 1, 19, 11, 7, 20, 0, 21, 28, 50,
      9, 32, 34, 31, 26, 27, 47, 37, 33, 48, 40, 41, 13,
    ],
    [
      24, 17, 39, 12, 2, 33, 22, 0, 16, 18, 43, 8, 14, 26, 9, 37, 34, 13, 7, 41,
      45, 49, 50, 19, 6, 20, 40, 5, 51, 42, 27, 48, 44, 23, 30, 35, 38, 3, 10,
      32, 36, 31, 46, 29, 28, 15, 21, 11, 1, 47, 4, 25,
    ],
    [
      28, 48, 21, 7, 45, 4, 50, 24, 51, 34, 8, 15, 1, 36, 22, 16, 12, 49, 30,
      23, 9, 47, 41, 3, 11, 37, 13, 0, 26, 38, 10, 20, 6, 44, 5, 43, 27, 29, 2,
      42, 32, 40, 31, 19, 39, 18, 35, 25, 33, 46, 14, 17,
    ],
    [
      12, 39, 48, 31, 46, 36, 50, 22, 23, 21, 29, 13, 38, 6, 3, 15, 45, 30, 40,
      26, 41, 16, 5, 7, 25, 28, 2, 42, 18, 37, 11, 9, 17, 47, 33, 4, 20, 35, 0,
      49, 24, 14, 1, 10, 34, 32, 27, 19, 8, 44, 43, 51,
    ],
    [
      30, 2, 39, 19, 9, 41, 26, 46, 45, 16, 10, 37, 42, 22, 4, 21, 32, 40, 35,
      50, 12, 15, 1, 24, 0, 3, 7, 33, 13, 48, 18, 20, 44, 28, 27, 51, 11, 5, 49,
      38, 17, 43, 23, 25, 36, 14, 6, 34, 29, 8, 47, 31,
    ],
    [
      51, 6, 12, 5, 17, 8, 9, 48, 22, 7, 21, 27, 50, 3, 29, 36, 39, 23, 1, 15,
      11, 35, 45, 40, 16, 2, 0, 20, 14, 34, 26, 13, 18, 19, 47, 44, 38, 37, 41,
      10, 46, 32, 42, 24, 28, 4, 49, 25, 30, 33, 31, 43,
    ],
    [
      35, 4, 51, 17, 23, 34, 24, 15, 0, 25, 6, 47, 22, 18, 32, 27, 39, 20, 2,
      50, 44, 21, 31, 5, 41, 33, 40, 49, 3, 13, 9, 16, 30, 45, 46, 42, 1, 29,
      48, 10, 12, 8, 11, 14, 38, 43, 19, 36, 26, 37, 7, 28,
    ],
    [
      2, 47, 22, 45, 19, 12, 15, 16, 40, 29, 24, 44, 37, 8, 39, 7, 46, 20, 9,
      26, 36, 51, 5, 21, 30, 13, 27, 28, 14, 31, 17, 1, 49, 34, 18, 6, 42, 43,
      32, 3, 25, 50, 4, 41, 48, 23, 10, 35, 38, 0, 33, 11,
    ],
    // [
    //   23, 10, 13, 12, 25, 14, 4, 16, 28, 51, 43, 40, 32, 18, 21, 2, 15, 44, 39,
    //   29, 36, 19, 0, 49, 24, 22, 46, 20, 47, 9, 38, 1, 7, 37, 31, 3, 6, 27, 41,
    //   48, 26, 45, 50, 11, 34, 33, 30, 42, 5, 17, 8, 35,
    // ],
    // [
    //   12, 46, 17, 4, 26, 8, 32, 18, 36, 3, 24, 33, 40, 39, 49, 30, 7, 31, 38,
    //   45, 42, 9, 6, 10, 21, 44, 1, 41, 13, 29, 16, 34, 22, 35, 5, 14, 51, 2, 50,
    //   28, 25, 48, 19, 37, 27, 47, 23, 11, 0, 20, 43, 15,
    // ],
    // [
    //   6, 13, 50, 10, 23, 48, 18, 36, 16, 38, 51, 46, 1, 44, 22, 9, 27, 24, 19,
    //   33, 15, 11, 7, 26, 39, 32, 28, 47, 14, 45, 5, 43, 20, 4, 34, 0, 35, 49,
    //   21, 40, 25, 37, 30, 42, 8, 2, 12, 3, 29, 17, 31, 41,
    // ],
    // [
    //   5, 41, 13, 26, 16, 42, 30, 24, 21, 35, 17, 51, 10, 1, 8, 15, 49, 33, 45,
    //   38, 31, 50, 7, 23, 47, 4, 11, 3, 43, 19, 28, 46, 25, 9, 40, 20, 14, 32,
    //   37, 2, 48, 36, 44, 18, 27, 39, 12, 22, 34, 0, 6, 29,
    // ],
    // [
    //   47, 9, 29, 24, 16, 22, 27, 45, 8, 19, 11, 43, 2, 14, 31, 41, 26, 30, 18,
    //   13, 35, 42, 50, 25, 0, 40, 28, 32, 10, 3, 6, 39, 20, 38, 46, 21, 23, 36,
    //   44, 17, 5, 15, 37, 1, 33, 4, 12, 7, 49, 34, 48, 51,
    // ],
    // [
    //   48, 23, 44, 8, 4, 33, 36, 50, 6, 18, 7, 3, 24, 20, 17, 39, 30, 9, 10, 14,
    //   29, 1, 27, 49, 35, 0, 32, 41, 38, 46, 40, 15, 11, 22, 21, 47, 12, 51, 19,
    //   31, 13, 28, 2, 45, 34, 5, 25, 43, 37, 42, 16, 26,
    // ],
    // [
    //   41, 13, 28, 3, 7, 42, 48, 19, 45, 27, 2, 0, 34, 20, 38, 31, 46, 32, 40,
    //   50, 18, 16, 29, 4, 37, 1, 47, 6, 26, 49, 5, 36, 30, 44, 39, 51, 11, 33,
    //   15, 10, 22, 25, 9, 21, 43, 17, 35, 14, 23, 24, 8, 12,
    // ],
    // [
    //   26, 25, 5, 39, 10, 43, 14, 37, 4, 32, 0, 22, 3, 17, 12, 15, 48, 31, 27,
    //   24, 49, 34, 46, 20, 18, 35, 11, 28, 1, 47, 16, 13, 40, 45, 29, 38, 33, 19,
    //   21, 42, 41, 6, 8, 50, 36, 44, 7, 23, 30, 2, 9, 51,
    // ],
    // [
    //   5, 44, 51, 48, 45, 9, 2, 26, 3, 12, 41, 1, 20, 27, 18, 38, 50, 32, 23, 13,
    //   19, 21, 25, 35, 31, 8, 42, 28, 33, 7, 29, 16, 39, 17, 43, 24, 14, 46, 34,
    //   37, 4, 49, 15, 47, 30, 11, 40, 10, 36, 22, 0, 6,
    // ],
    // [
    //   15, 46, 0, 39, 10, 44, 3, 37, 4, 49, 11, 31, 30, 23, 27, 34, 14, 47, 5,
    //   19, 26, 43, 20, 12, 24, 29, 32, 50, 41, 13, 42, 25, 22, 8, 21, 51, 6, 33,
    //   9, 36, 28, 2, 18, 16, 35, 40, 1, 7, 17, 45, 48, 38,
    // ],
  ]);
  const [currentGame, setCurrentGame] = useState(1);

  const { state } = useContext(AppContext);

  useEffect(() => {
    if (state.foundBy) {
      const desk = state.crawingRoom[state.foundBy].cardDesk;
      const lastIndex = desk.length - 1;
      const lastGame = desk[lastIndex];
      const lastCards = Object.values(lastGame);

      if (
        lastIndex > 0 &&
        lastCards.length === 4 &&
        cards.length === lastIndex - 1
      ) {
        const mappedCard = ([] as number[]).concat(...lastCards);
        setCards((pre) => [...pre, mappedCard]);
      }
    }
  }, [state.foundAt, state.crawingRoom]);

  // const cards = useMemo(() => {
  //   if (state.foundBy) {
  //     const desk = state.crawingRoom[state.foundBy].cardDesk;
  //     const card = desk.map((game) => {
  //       const arr = Object.values(game);
  //       if (arr.length === 4) {
  //         return ([] as number[]).concat(...arr);
  //       }
  //       return [];
  //     });

  //     return card;
  //   }

  //   return [];
  // }, [state.crawingRoom]);

  // console.log(cards);

  return (
    <div className="text-center relative">
      <div className="py-[20px]">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>All card in room</CardTitle>
            <CardDescription>
              Manage your products and view their sales performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cards.map((card, index) => (
                  <TableRow
                    key={index}
                    className={`relative !rounded-[20px] ${
                      index + 1 == currentGame &&
                      'bg-[#9c9c9c] bg-opacity-60 hover:bg-[#9c9c9c]'
                    }`}
                  >
                    <BoardCard
                      cards={card}
                      indexProps={index}
                      numPlayers={cardDeck.cardDeck}
                    />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>{cards.length}</strong> of cards
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
