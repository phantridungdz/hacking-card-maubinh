import { Hand } from 'lucide-react';
import React from 'react';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio';
import { Label } from '../ui/label';

const HandType: React.FC<any> = ({ cardDeck, setCardDeck }) => {
  return (
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
          <RadioGroupItem value="2" id="option-two" className=" border-white" />
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
  );
};

export default HandType;
