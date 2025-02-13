import Modal from "../modal/Modal";
import { useState, useEffect } from "react";
import "./SeminarList.css";

function SeminarsList() {
  // Состояние для хранения списка семинаров, состояния загрузки, ошибок и информации о модальном окне
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, seminar: null });

  // useEffect хук для загрузки данных при монтировании компонента
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Запрос к JSON-серверу и преобразование ответа в JSON
        const data = await fetch("http://localhost:3000/seminars").then((res) =>
          res.json()
        );
        // Обновление состояния семинаров и установка состояния загрузки в false
        setSeminars(data);
        setLoading(false);
      } catch (err) {
        // Обработка ошибок и установка состояния ошибки и загрузки
        setError(err);
        setLoading(false);
      }
    };
    // Вызов функции fetchData
    fetchData();
  }, []); // Пустой массив зависимостей означает, что эффект выполнится только при монтировании

  // Функция для выполнения API-запросов (DELETE, PUT)
  const apiCall = async (url, method, body) => {
    const options = { method, headers: { "Content-Type": "application/json" } };
    if (body) options.body = JSON.stringify(body); // Добавление тела запроса, если оно есть
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
    return response.json(); // Возврат JSON-данных из ответа
  };

  // Функция для удаления семинара
  const handleDeleteSeminar = async (id) => {
    // Отображение окна подтверждения перед удалением
    if (!window.confirm("Удалить семинар?")) return;
    try {
      // Отправка DELETE-запроса на сервер
      await apiCall(`http://localhost:3000/seminars/${id}`, "DELETE");
      // Обновление состояния семинаров после успешного удаления
      setSeminars(seminars.filter((s) => s.id !== id));
    } catch (err) {
      // Обработка ошибок
      setError(err);
    }
  };

  // Функция для открытия модального окна редактирования
  const handleEditSeminar = (seminar) => setModal({ isOpen: true, seminar });
  // Функция для закрытия модального окна
  const closeModal = () => setModal({ isOpen: false, seminar: null });

  // Функция для сохранения изменений семинара
  const handleSaveSeminar = async (seminar) => {
    try {
      // Отправка PUT-запроса на сервер для обновления данных
      const updatedSeminar = await apiCall(
        `http://localhost:3000/seminars/${seminar.id}`,
        "PUT",
        seminar
      );
      // Обновление состояния семинаров с новыми данными
      setSeminars(
        seminars.map((s) => (s.id === updatedSeminar.id ? updatedSeminar : s))
      );
      // Закрытие модального окна
      closeModal();
    } catch (err) {
      // Обработка ошибок
      setError(err);
    }
  };

  // Отображение индикатора загрузки, если данные еще не загружены
  if (loading) return <p>Загрузка...</p>;
  // Отображение сообщения об ошибке, если произошла ошибка
  if (error) return <p>Ошибка: {error.message}</p>;

  // Рендеринг списка семинаров
  return (
    <div>
      <ul>
        {seminars.map((s) => (
          <div className="seminars" key={s.id}>
            {/* Отображение заголовка и описания семинара */}
            <p>
              <strong>{s.title}</strong> - {s.description}
            </p>
            <img className="seminars-img" src={s.photo} />
            {/* Кнопка удаления семинара */}
            <div>
              <button onClick={() => handleDeleteSeminar(s.id)}>Удалить</button>
              {/* Кнопка редактирования семинара */}
              <button onClick={() => handleEditSeminar(s)}>
                Редактировать
              </button>
            </div>
          </div>
        ))}
      </ul>

      {/* Рендеринг модального окна, если оно открыто */}
      {modal.isOpen && (
        <Modal
          seminar={modal.seminar}
          onClose={closeModal}
          onSave={handleSaveSeminar}
        />
      )}
    </div>
  );
}

export default SeminarsList;
