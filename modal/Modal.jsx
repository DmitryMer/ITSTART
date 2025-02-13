import { useState } from "react";
import "./Modal.css";

const Modal = ({ seminar, onClose, onSave }) => {
  // Состояние для хранения редактируемого семинара
  const [editedSeminar, setEditedSeminar] = useState({ ...seminar });

  // Функция для обработки изменений в форме
  const handleChange = (e) => {
    setEditedSeminar({ ...editedSeminar, [e.target.name]: e.target.value });
  };

  // Рендеринг модального окна
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Редактировать семинар</h2>
        <label>Заголовок:</label>
        <input
          type="text"
          name="title"
          value={editedSeminar.title}
          onChange={handleChange}
        />
        <label>Описание:</label>
        <textarea
          name="description"
          value={editedSeminar.description}
          onChange={handleChange}
        />
        <button onClick={() => onSave(editedSeminar)}>Сохранить</button>
      </div>
    </div>
  );
};

export default Modal;
