import React from 'react';
import useGameConfigStore from '../../store/gameConfigStore';

interface CardProps {
  imageUrl: string;
  altText?: string;
}

const CardGame: React.FC<CardProps> = ({ imageUrl, altText }) => {
  const { cardType } = useGameConfigStore();
  return (
    <div
      className={`${
        cardType === 'set1' &&
        'bg-white border-[#424141] border-[1px] py-[4%] px-[3%]'
      }   `}
      style={{
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderRadius: cardType === 'set1' ? '7%' : '',
        maxWidth: '300px',
      }}
    >
      <img
        src={imageUrl}
        alt={altText || 'Card image'}
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
};

export default CardGame;
