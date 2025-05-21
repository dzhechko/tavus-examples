import { IConversation } from "@/types";

export const createConversation = async (
  token: string,
): Promise<IConversation> => {
  const response = await fetch("https://tavusapi.com/v2/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": token ?? "",
    },
    body: JSON.stringify({
      // Замените на ваш Persona ID или используйте текущий для Санты
      // persona_id: "p3bb4745d4f9", // ID персоны Санты в Tavus
      persona_id: "p09e93e59c31", // Новый Persona ID
      // Можно указать конкретную реплику (внешний вид аватара)
      // replica_id: "r3fbe3834a3e", // ID реплики Санты
      replica_id: "rb17cf590e15", // Новый Replica ID
      // Название беседы
      // conversation_name: "Разговор с Сантой",
      conversation_name: "Разговор с учителем английского",
      // Контекстная информация для разговора (база знаний для разговора)
      // conversational_context: "Вы собираетесь поговорить с Санта-Клаусом, радостным символом праздничного настроения. Санта знает обо всех детях, были ли они хорошими или плохими. Санта проживает на Северном полюсе и развозит подарки на своих санях с оленями. Главного оленя зовут Рудольф. Санта работает с эльфами, которые делают игрушки.",
      conversational_context: "Вы собираетесь поговорить с учителем английского, который поможет вам изучить английский язык. Учитель поможет вам изучить английский язык, а также ответит на все ваши вопросы.",
      // Приветственное сообщение
      // custom_greeting: "Хо-Хо-Хо! С Рождеством! Чем Санта может вам помочь сегодня?",
      custom_greeting: "Hello! How can I help you today?",
      // Дополнительные настройки
      properties: {
        // language: "russian", // Язык разговора (доступно более 30 языков)
        language: "english",
      },
    }),
  });

  if (!response?.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};
