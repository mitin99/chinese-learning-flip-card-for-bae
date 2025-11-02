import { useState, useCallback } from 'react';
import { Card } from 'antd';
import type { Card as CardType } from '../types';
import './FlipCard.css';

interface FlipCardProps {
  card: CardType;
}

export default function FlipCard({ card }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleFlip();
      }
    },
    [handleFlip],
  );

  return (
    <div
      className="flip-card-container"
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Flip card to see translation"
    >
      <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
        <div className="flip-card-front">
          <Card className="card-content">
            <div className="card-text chinese">{card.chinese}</div>
            {card.pinyin && (
              <div className="card-text pinyin">{card.pinyin}</div>
            )}
            <div className="card-hint">Nhấp để xem</div>
          </Card>
        </div>
        <div className="flip-card-back">
          <Card className="card-content">
            <div className="card-text vietnamese">{card.vietnamese}</div>
            {card.categories && card.categories.length > 0 && (
              <div className="card-categories">
                {card.categories.map((cat) => (
                  <span key={cat} className="category-tag">
                    {cat}
                  </span>
                ))}
              </div>
            )}
            <div className="card-hint">Nhấp để quay lại</div>
          </Card>
        </div>
      </div>
    </div>
  );
}

