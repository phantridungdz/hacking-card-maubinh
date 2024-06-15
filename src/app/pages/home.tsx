import BoardCard from 'components/card/boardCard';
import { Table, TableBody, TableRow } from 'components/ui/table';
import { Tabs, TabsContent } from 'components/ui/tabs';
import { Plus } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { TerminalBoard } from '../../components/terminal/terminalBoard';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../../components/ui/resizablePanelGroup';
import { getRandomCards } from '../../lib/card';
import { AppContext } from '../../renderer/providers/app';
import useAccountStore from '../../store/accountStore';
import useGameConfigStore from '../../store/gameConfigStore';
import useGameStore from '../../store/gameStore';

export const HomePage: React.FC<any> = ({ cardDeck, setCardDeck }) => {
  const [cards, setCards] = useState<number[][]>([]);
  const { state } = useContext(AppContext);
  const { crawledCards, isFoundedRoom } = useGameStore();
  const { accounts } = useAccountStore();
  const { currentTargetSite } = useGameConfigStore();

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
    setCards((prevCards) => [...prevCards, getRandomCards()]);
    setCards((prevCards) => [...prevCards, getRandomCards()]);
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="mt-[120px] relative min-h-screen !overflow-visible"
    >
      <ResizablePanel defaultSize={65}>
        <Card>
          <CardHeader>
            <CardTitle>All card in room</CardTitle>
          </CardHeader>
          <Tabs
            defaultValue="2"
            onValueChange={setCardDeck}
            value={cardDeck}
            className="w-full p-4"
          >
            <TabsContent forceMount hidden={'2' !== cardDeck} value="2">
              <Card>
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
                          numPlayers={2}
                          currentGame={state.currentGame}
                        />
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
            <TabsContent forceMount hidden={'3' !== cardDeck} value="3">
              <Card>
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
                          numPlayers={3}
                          currentGame={state.currentGame}
                        />
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
            <TabsContent forceMount hidden={'4' !== cardDeck} value="4">
              <Card>
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
                          numPlayers={4}
                          currentGame={state.currentGame}
                        />
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </Tabs>
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
      </ResizablePanel>
      <ResizableHandle className="mx-2" />
      <ResizablePanel className="!overflow-visible">
        <div className=" sticky top-[90px]">
          <Card className="w-full flex flex-col gap-4 border-0 ">
            {accounts['MAIN'].map(
              (main: any, index: any) =>
                main.isSelected &&
                main.targetSite === currentTargetSite && (
                  <TerminalBoard key={index} main={main} />
                )
            )}
          </Card>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
