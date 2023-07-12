import Success from '../images/logo/Union.svg';
import Unsuccess from '../images/logo/Unsuccess.svg';

function InfoTooltip({ onClose, isPopupOpen, isSuccess }) {
  return (
    <div className={`popup  ${isPopupOpen ? 'popup_opened' : ''}`} onClick={onClose}>
      <div className=" popup__container popup__info ">
        <img src={isSuccess ? Success : Unsuccess} alt="" className="popup__info-image" />
        <h2 className="popup__info-text">
          {isSuccess
            ? 'Вы успешно зарегистрировались!'
            : 'Что-то пошло не так! Попробуйте ещё раз.'}
        </h2>
        <button
          type="button"
          aria-label="Закрыть"
          className="popup__close-icon"
          onClick={onClose}
        />
      </div>
    </div>
  );
}

export default InfoTooltip;
