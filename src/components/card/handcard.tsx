import { Label } from '@radix-ui/react-label';
import { debounce } from 'lodash';
import { Loader, RotateCw, Star } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { DndProvider, DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { arrangeCard } from '../../lib/arrangeCard';
import { getCardImageUrl } from '../../lib/card';
import useGameConfigStore from '../../store/gameConfigStore';
import useGameStore from '../../store/gameStore';
import CardGame from '../card/card';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
interface DraggableCardProps {
  id: number;
  imageUrl: string;
  moveCard: (dragId: number, hoverId: number) => void;
}

interface HandCardProps {
  index: number;
  cardProp: number[];
  key: number;
}

const DraggableCard: React.FC<DraggableCardProps> = ({
  id,
  imageUrl,
  moveCard,
}) => {
  const [, drag] = useDrag({
    type: 'card',
    item: { id },
    end: (item: { id: number } | undefined, monitor: DragSourceMonitor) => {
      const dropResult = monitor.getDropResult<{ id: number }>();
      if (item && dropResult) {
        moveCard(item.id, dropResult.id);
      }
    },
  });

  return (
    <div ref={drag} className="">
      <CardGame imageUrl={imageUrl} />
    </div>
  );
};

interface DropCardProps {
  id: number;
  children: React.ReactNode;
  moveCard: (dragId: number, hoverId: number) => void;
}

const DropCard: React.FC<DropCardProps> = ({ id, children, moveCard }) => {
  const [, drop] = useDrop({
    accept: 'card',
    drop: () => ({ id }),
  });

  return <div ref={drop}>{children}</div>;
};

export const HandCard: React.FC<HandCardProps> = ({ index, cardProp }) => {
  const [cards, setCards] = useState<number[]>(cardProp ?? []);
  const [part1, setPart1] = useState<number[]>(cards.slice(0, 5));
  const [part2, setPart2] = useState<number[]>(cards.slice(5, 10));
  const [part3, setPart3] = useState<number[]>([...cards.slice(10, 13)]);
  const [evaluation1, setEvaluation1] = useState<string>('');
  const [evaluation2, setEvaluation2] = useState<string>('');
  const [evaluation3, setEvaluation3] = useState<string>('');
  const [isInstant, setIsInstant] = useState<boolean>(false);
  const [titleInstant, setTitleInstant] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { mainCard, setActiveGame } = useGameStore();
  const { cardType } = useGameConfigStore();

  const moveCard = useCallback(
    (dragId: number, hoverId: number) => {
      const dragIndex = cards.indexOf(dragId);
      const hoverIndex = cards.indexOf(hoverId);

      if (dragIndex !== hoverIndex) {
        const newCards = [...cards];
        newCards[dragIndex] = cards[hoverIndex];
        newCards[hoverIndex] = cards[dragIndex];
        setCards(newCards);
        const part1 = newCards.slice(0, 5);
        const part2 = newCards.slice(5, 10);
        const part3 = [...newCards.slice(10, 13)];
        setPart1(part1);
        setPart2(part2);
        setPart3(part3);
      }
    },
    [cards]
  );

  function renderBackgroundColor() {
    const specialEvaluations = ['TP Sảnh', 'Tứ Quý'];
    if (isInstant) {
      return 'bg-red-500 bg-opacity-90 shadow-[0_0px_10px_rgba(255,_31,_31,_0.8)]';
    }
    if (
      specialEvaluations.includes(evaluation1) ||
      specialEvaluations.includes(evaluation2) ||
      specialEvaluations.includes(evaluation3) ||
      evaluation2 == 'Cù lũ' ||
      evaluation3 == 'Sam'
    ) {
      return 'bg-orange-500 bg-opacity-100 shadow-[0_0px_10px_rgba(255,_31,_31,_0.8)]';
    }

    return 'bg-opacity-20';
  }

  const handleArrange = useCallback(
    debounce((): void => {
      setLoading(true);
      const newCard = arrangeCard(cardProp) as any;
      setCards(newCard.cards);
      setEvaluation1(newCard.chi1);
      setEvaluation2(newCard.chi2);
      setEvaluation3(newCard.chi3);
      setIsInstant(newCard.instant ? true : false);
      setTitleInstant(newCard.instant);
      setLoading(false);
    }, 300),
    [cardProp]
  );

  useEffect(() => {
    if (cards) {
      setPart1(cards.slice(0, 5).reverse());
      setPart2(cards.slice(5, 10).reverse());
      setPart3([...cards.slice(10, 13).reverse()]);
    }
  }, [cards]);

  useEffect(() => {
    setCards(cardProp ?? []);
    handleArrange();
  }, [cardProp]);

  function arraysAreEqual(array1: string | any[], array2: string | any[]) {
    if (array1.length !== array2.length) {
      return false;
    }

    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }

    return true;
  }

  useEffect(() => {
    if (arraysAreEqual(mainCard, cardProp)) {
      setActiveGame(index);
    }
  }, [mainCard, cardProp]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Card
        className={`bg-[#252424] py-[10px] rounded-[15px] px-[7px] relative ${renderBackgroundColor()}`}
      >
        {titleInstant && (
          <div className="absolute top-[-20px] left-0 right-0 flex justify-center items-center ">
            <Label className="shadow-[0_0px_10px_rgba(255,_31,_31,_0.8)] py-[5px] px-[10px] border bg-background rounded-sm z-[20] flex flex-row gap-[3px] items-center font-bold">
              <Star className="w-3.5 h-3.5"></Star>
              {titleInstant}
            </Label>
          </div>
        )}
        {!loading ? (
          <div className="flex flex-col">
            <Label
              className={`py-1 px-[7px] mb-2 rounded-[5px] border font-semibold text-[13px] truncate bg-background `}
            >
              {evaluation1}
              {evaluation2 != '' && ' - '}
              {evaluation2}
              {evaluation3 != '' && ' - '}
              {evaluation3}
            </Label>

            <div className="grid grid-rows-3 gap-[5px] relative text-center font-bold text-[15px] ">
              <div className="flex flex-col gap-1.5">
                <div className="grid grid-cols-5 gap-[5px]">
                  {part3.map((cardNumber) => (
                    <DropCard
                      key={cardNumber}
                      id={cardNumber}
                      moveCard={moveCard}
                    >
                      <DraggableCard
                        id={cardNumber}
                        imageUrl={getCardImageUrl(cardNumber, cardType)}
                        moveCard={moveCard}
                      />
                    </DropCard>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="grid grid-cols-5 gap-[5px] relative">
                  {part2.map((cardNumber) => (
                    <DropCard
                      key={cardNumber}
                      id={cardNumber}
                      moveCard={moveCard}
                    >
                      <DraggableCard
                        id={cardNumber}
                        imageUrl={getCardImageUrl(cardNumber, cardType)}
                        moveCard={moveCard}
                      />
                    </DropCard>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="grid grid-cols-5 gap-[5px]">
                  {part1.map((cardNumber, index) => (
                    <DropCard key={index} id={cardNumber} moveCard={moveCard}>
                      <DraggableCard
                        id={cardNumber}
                        imageUrl={getCardImageUrl(cardNumber, cardType)}
                        moveCard={moveCard}
                      />
                    </DropCard>
                  ))}
                </div>
              </div>
              <div className="absolute top-0 right-0">
                <Button
                  className="p-[7px] h-[30px] py-0"
                  onClick={() => handleArrange()}
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <Loader className="w-6.5 h-6.5 animate-spin"></Loader>
          </div>
        )}
      </Card>
    </DndProvider>
  );
};
