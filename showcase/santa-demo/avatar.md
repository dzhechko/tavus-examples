# Пример интеграции 3D-аватара и общения с ним в Tavus Santa Demo

Этот файл демонстрирует пошагово, как в проекте происходит запуск 3D-аватара и обмен сообщениями с ним.

---

## 1. Создание беседы (API)

Файл `src/api/createConversation.ts` отвечает за инициализацию сеанса разговорного видео.

```typescript
import { IConversation } from "@/types";

export const createConversation = async (
  token: string,
): Promise<IConversation> => {
  // POST на эндпоинт Tavus CVI для создания новой беседы
  const response = await fetch("https://tavusapi.com/v2/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": token,
    },
    body: JSON.stringify({
      // Определяет «личность» (поведение, голос, знания)
      persona_id: "p3bb4745d4f9",
      // Определяет внешнюю 3D-модель аватара
      replica_id: "r3fbe3834a3e",
      conversation_name: "Разговор с Сантой",
      conversational_context: "...",    // ваша база знаний для диалога
      custom_greeting: "...",          // приветственное сообщение
      properties: { language: "russian" },
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};
```

**Комментарий:**
- `persona_id` и `replica_id` можно получить через Tavus Platform или API.
- Остальные поля задают контекст, имя беседы и язык.

---

## 2. Триггер создания беседы (Frontend)

Файл `src/screens/Instructions.tsx` — пользовательский экран с кнопкой запуска.

```tsx
// … внутри компонента Instructions:
const handleClick = async () => {
  // Ваша логика выбора микрофона и разрешений
  await createConversationRequest();
};

<Button onClick={handleClick}>Start Conversation with Santa</Button>
```

```tsx
// useCreateConversationMutation (хук инициализации):
const [ , setConversation ] = useAtom(conversationAtom);
const [, setScreen] = useAtom(screenAtom);

token = useAtomValue(apiTokenAtom);

async function createConversationRequest() {
  const conversation = await createConversation(token);
  // Сохраняем conversation_url и переходим на экран Conversation
  setConversation(conversation);
  setScreen({ currentScreen: 'conversation' });
}
```

**Комментарий:**
- При нажатии вызывается `createConversation`, результат сохраняется в атоме `conversationAtom`.
- После этого экран меняется на `conversation`.

---

## 3. Подключение и отображение аватара

Файл `src/screens/Conversation.tsx` управляет WebRTC-сессией и рендерит видео.

```tsx
import {
  useDaily,
  useParticipantIds,
  useLocalSessionId,
  useVideoTrack,
  useAudioTrack,
  DailyAudio,
} from '@daily-co/daily-react';
import Video from '@/components/Video';

export const Conversation: React.FC = () => {
  const daily = useDaily();
  const { conversation_url } = useAtomValue(conversationAtom)!;
  const remoteIds = useParticipantIds({ filter: 'remote' });
  const localId = useLocalSessionId();

  // При изменении URL соединяемся в комнату
  useEffect(() => {
    if (conversation_url) {
      daily.join({ url: conversation_url, startVideoOff: false, startAudioOff: true });
    }
  }, [conversation_url]);

  // После появления удалённого участника включаем микрофон
  useEffect(() => {
    if (remoteIds.length) {
      daily.setLocalAudio(true);
    }
  }, [remoteIds]);

  return (
    <>
      {/* Видео аватара (удалённый участник) */}
      {remoteIds[0] && <Video id={remoteIds[0]} className="size-full" />}
      {/* Видеопоток вашего локального превью */}
      {localId && <Video id={localId} className="local-preview" />}
      {/* Воспроизведение аудио от аватара */}
      <DailyAudio />
    </>
  );
};
```

**Комментарий:**
- `daily.join` устанавливает WebRTC-соединение по `conversation_url`.
- `useParticipantIds({filter:'remote'})` даёт ID аватара.
- Компонент `<Video>` рендерит видео по sessionId.
- `<DailyAudio>` воспроизводит аудио-поток.

---

## 4. Компонент Video

Файл `src/components/Video.tsx` оборачивает DailyVideo и отслеживает состояние трека.

```tsx
import { DailyVideo, useVideoTrack } from '@daily-co/daily-react';

export default function Video({ id, className }) {
  const track = useVideoTrack(id);
  return (
    <div className={className} style={{ display: track.isOff ? 'none' : 'block' }}>
      <DailyVideo sessionId={id} type="video" className="size-full object-cover" />
    </div>
  );
}
```

**Комментарий:**
- Хук `useVideoTrack(id)` сообщает, есть ли видео.
- `<DailyVideo>` рендерит WebRTC-видео.

---

## 5. Итоговая схема работы

1. **Инициация:** Пользователь нажимает кнопку → `createConversation` → получаем `conversation_url`.
2. **Соединение:** `daily.join(url)` устанавливает WebRTC-канал между клиентом и сервером CVI.
3. **Стриминг:**
   - Сервер CVI анализирует аудио (STT), LLM создаёт ответ, TTS синтезирует голос.
   - Phoenix + Hummingbird генерируют анимированное видео.
   - Видео/аудио поток возвращается в комнату.
4. **Отображение:** Клиент рендерит видео через `<Video>` и звук через `<DailyAudio>`.

Теперь этот файл можно использовать как шаблон для подключения 3D-аватара в других проектах Tavus CVI. 