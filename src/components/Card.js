import { useContext } from 'react';
import CurrentUserContext from '../contexts/CurrentUserContext';

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = useContext(CurrentUserContext);
  const isOwn = card.owner._id === currentUser._id;
  const isLiked = card.likes.some(i => i._id === currentUser._id);

  const handleLikeClick = () => {
    onCardLike(card);
  };
  const handleDeleteClick = () => {
    onCardDelete(card);
  };

  const handleCardClick = () => {
    onCardClick({ link: card.link, name: card.name });
  };

  return (
    <article className="card">
      <div
        style={{ backgroundImage: `url(${card.link})` }}
        className="card__image"
        onClick={handleCardClick}
      />
      <div className="card__text">
        <h2 className="card__title">{`${card.name}`}</h2>
        <div className="card__like">
          <button
            type="button"
            className={`card__heart ${isLiked ? 'card__heart_active' : ''}`}
            onClick={handleLikeClick}
          />
          <span className="card__heart-count">{card.likes.length}</span>
        </div>
      </div>
      {isOwn && <button type="button" className="card__delete" onClick={handleDeleteClick} />}
    </article>
  );
}

export default Card;
