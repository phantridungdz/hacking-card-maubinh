import { Label } from '@radix-ui/react-label';
import { RotateCw } from 'lucide-react';
import { useCallback, useEffect, useId, useState } from 'react';
import { DndProvider, DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getCardImageUrl } from '../../lib/card';
import CardGame from '../card/card';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
interface DraggableCardProps {
  id: number;
  imageUrl: string;
  moveCard: (dragId: number, hoverId: number) => void;
}

interface HandCardProps {
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

export const HandCard: React.FC<HandCardProps> = ({ cardProp }) => {
  const idHand = useId();
  const [cards, setCards] = useState<number[]>(cardProp);
  const [part1, setPart1] = useState<number[]>(cards.slice(0, 5));
  const [part2, setPart2] = useState<number[]>(cards.slice(5, 10));
  const [part3, setPart3] = useState<number[]>([...cards.slice(10, 13)]);
  const [evaluation1, setEvaluation1] = useState<string>('');
  const [evaluation2, setEvaluation2] = useState<string>('');
  const [evaluation3, setEvaluation3] = useState<string>('');

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

  const renderCard = useCallback((cardNumber: number, index: number) => {
    return cardNumber !== 99 ? (
      <DropCard key={index} id={cardNumber} moveCard={moveCard}>
        <DraggableCard
          id={cardNumber}
          imageUrl={getCardImageUrl(cardNumber)}
          moveCard={moveCard}
        />
      </DropCard>
    ) : (
      <div key={index}></div>
    );
  }, []);

  const handleArrange = (): void => {
    console.log('cards', cards);
    window.backend.sendMessage('arrange-card', cardProp, idHand);
  };

  useEffect(() => {
    setPart1(cards.slice(0, 5));
    setPart2(cards.slice(5, 10));
    setPart3([...cards.slice(10, 13)]);
  }, [cards]);

  useEffect(() => {
    setCards(cardProp);
    handleArrange();
    // setEvaluation1('');
    // setEvaluation2('');
    // setEvaluation3('');
  }, [cardProp]);

  useEffect(() => {
    const handleData = (newData: any, position: any) => {
      if (position === idHand) {
        console.log('newData', newData);
        setCards(newData.cards);
        setEvaluation1(newData.chi1.type);
        setEvaluation2(newData.chi2.type);
        setEvaluation3(newData.chi3.type);
      }
    };

    window.backend.on('arrange-card', handleData);

    return () => {
      window.backend.removeListener('arrange-card', handleData);
    };
  }, [handleArrange]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Card className="bg-[#252425] bg-opacity-20 py-[10px] rounded-[15px] px-[7px] shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]">
        <div className="grid grid-rows-3 gap-[5px] relative">
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-5 gap-[5px]">
              {/* {part3.map((cardNumber, index) => renderCard(cardNumber, index))} */}
              {part3.map((cardNumber) => (
                <DropCard key={cardNumber} id={cardNumber} moveCard={moveCard}>
                  <DraggableCard
                    id={cardNumber}
                    imageUrl={getCardImageUrl(cardNumber)}
                    moveCard={moveCard}
                  />
                </DropCard>
              ))}
            </div>

            <Label className=" bg-background p-[5px] rounded-[5px] font-semibold">
              {evaluation3}
            </Label>
          </div>
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-5 gap-[5px] relative">
              {part2.map((cardNumber) => (
                <DropCard key={cardNumber} id={cardNumber} moveCard={moveCard}>
                  <DraggableCard
                    id={cardNumber}
                    imageUrl={getCardImageUrl(cardNumber)}
                    moveCard={moveCard}
                  />
                </DropCard>
              ))}
            </div>
            <Label className=" bg-background p-[5px] rounded-[5px] font-semibold">
              {evaluation2}
            </Label>
          </div>
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-5 gap-[5px]">
              {part1.map((cardNumber, index) => (
                <DropCard key={index} id={cardNumber} moveCard={moveCard}>
                  <DraggableCard
                    id={cardNumber}
                    imageUrl={getCardImageUrl(cardNumber)}
                    moveCard={moveCard}
                  />
                </DropCard>
              ))}
            </div>
            <Label className=" bg-background p-[5px] rounded-[5px] font-semibold">
              {evaluation1}
            </Label>
          </div>
          <div className="absolute top-0 right-0">
            <Button className="p-0 px-[5px]" onClick={() => handleArrange()}>
              <RotateCw />
            </Button>
          </div>
        </div>
      </Card>
    </DndProvider>
  );
};
