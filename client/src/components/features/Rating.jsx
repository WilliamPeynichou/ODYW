import React, { useState } from 'react';

const Rating = ({ videoId, initialRating = 0, onRatingChange }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (value) => {
    setRating(value);
    if (onRatingChange) {
      onRatingChange(value);
    }
    // TODO: Appel API pour sauvegarder la note
    // await fetch(`/api/videos/${videoId}/rating`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ rating: value })
    // });
  };

  const handleStarHover = (value) => {
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-3">
      <div 
        className="flex items-center gap-0.5"
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            className="focus:outline-none transition-transform hover:scale-110 active:scale-95 p-1"
            aria-label={`Noter ${star} étoile${star > 1 ? 's' : ''}`}
          >
            <svg
              className={`w-7 h-7 transition-all duration-150 ${
                star <= displayRating
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-300 fill-gray-300'
              }`}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>
      {rating > 0 && (
        <span className="text-sm text-gray-700 font-semibold">
          {rating}/5
        </span>
      )}
    </div>
  );
};

export default Rating;

