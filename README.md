# FitIn

Кросс-платформенное фитнес-приложение для Android и iOS. Трекинг тренировок, питания, социальные функции и AI-ассистент.

Построено на **React Native + Expo SDK 54**, **Firebase** (Auth / Firestore / Cloud Functions) и **Claude Sonnet 4.6**.

[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Expo](https://img.shields.io/badge/Expo-SDK_54-000020?logo=expo&logoColor=white)](https://expo.dev/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![CI](https://github.com/stephencryyy/FitIn/actions/workflows/ci.yml/badge.svg)](https://github.com/stephencryyy/FitIn/actions/workflows/ci.yml)

---

## 🚀 Quick Start (5 минут)

```bash
git clone https://github.com/stephencryyy/FitIn.git
cd FitIn
npm install
cp .env.example .env
# Заполни .env значениями из Firebase Console (см. "Настройка Firebase" ниже)
npm start
```

Дальше нажми `w` (web), `a` (Android) или отсканируй QR в Expo Go на телефоне.

> **AI-ассистент и поиск еды** требуют Cloud Functions — это отдельный шаг, см. ниже. Без Cloud Functions всё остальное (тренировки, питание через Quick Add, соцсеть) работает.

---

## Возможности

### Тренировки
- **87+ встроенных упражнений** с переводом на русский — грудь, спина, плечи, бицепс, трицепс, ноги, пресс, кардио, растяжка
- **Кастомные упражнения** — создавай свои с указанием категории, мышц, инвентаря и инструкции
- **Логирование подходов** — адаптивные поля в зависимости от категории:
  - **Сила** (штанга/гантели): КГ + ПОВТОРЕНИЯ
  - **Своим весом** (подтягивания/отжимания): +КГ (доп. вес, опционально) + ПОВТОРЕНИЯ
  - **Кардио** (бег/велосипед): ВРЕМЯ + ДИСТАНЦИЯ
  - **Растяжка** (планка/поза): ВРЕМЯ
- **Таймер отдыха** — автоматически стартует после завершения подхода, +15/-15 секунд, настраиваемая длительность по умолчанию (30-300 сек)
- **Личные рекорды** — автоматическое определение PR через Cloud Functions
- **История тренировок** — полный список с датами, объёмом, длительностью
- **Графики прогресса** — линейные графики объёма и количества упражнений за последние 10 тренировок
- **Модалка завершения** — красивый итог с haptic-фидбеком: длительность, объём, кол-во упражнений и подходов

### Питание
- **Калькулятор калорий** — автоматический расчёт BMR (формула Миффлина-Сан-Жеора), TDEE, целевых калорий и макросов на основе профиля
- **Поиск продуктов** — интеграция с OpenFoodFacts API через Cloud Function (прокси для безопасности)
- **Quick Add** — быстрый ручной ввод: название, калории, белки, углеводы, жиры, клетчатка
- **4 приёма пищи** — завтрак, обед, ужин, перекусы
- **Трекинг воды** — +250 / -250 мл с отображением суммы за день
- **Дневная сводка** — прогресс-бар калорий, макросы с целевыми значениями

### Социальные функции
- **Публичные профили** — имя, аватар, username (@никнейм), статистика
- **Уникальные username** — проверка доступности в реальном времени, атомарное резервирование через Firestore транзакции
- **Подписки** — follow/unfollow с оптимистичным обновлением UI
- **Лента активности** — тренировки пользователей, на которых подписан, с pull-to-refresh
- **Рекомендации** — при пустой ленте показываются предложенные пользователи для подписки
- **Поиск** — по имени и @username, включая прямой lookup по никнейму
- **Команды** — создание, просмотр, вступление (UI готов, backend scaffolded)
- **Тренер-клиент** — модель отношений с гранулярными правами доступа (view workouts, modify plans, view nutrition)

### AI Ассистент
- **Claude Sonnet 4.6** через Cloud Functions — никогда не вызывается с клиента
- **Контекст пользователя** — профиль, последние 5 тренировок, сегодняшнее питание, личные рекорды
- **Rate limiting** — 10 запросов/час на пользователя (Firestore-based)
- **История чатов** — сохранение в `users/{userId}/assistantChats`
- **Подсказки** — готовые промты для быстрого старта ("Составь план тренировок", "Что мне есть?" и т.д.)

### Локализация
- **Русский + English** — полный перевод всех экранов, включая 87 названий упражнений, группы мышц, инвентарь
- **Автоопределение** — язык устройства определяется через `expo-localization`
- **Переключатель** — Settings > Language, модалка с флагами, мгновенная смена без перезагрузки
- **Испанский и Немецкий** — запланированы, пока отмечены как "Coming Soon"

### Прочее
- **Skip onboarding** — можно пропустить анкету и заполнить позже через Edit Profile
- **Автоформат даты** — ввод `20030502` автоматически превращается в `2003-05-02`
- **Адаптивные иконки** — MaterialCommunityIcons с цветовой кодировкой по группам мышц
- **FAB AI-ассистента** — автоматически скрывается во время активной тренировки
- **Pull-to-refresh** — на ленте, истории тренировок, дашборде

---

## Стек технологий

| Область | Технология | Зачем |
|---------|-----------|-------|
| Фреймворк | React Native + Expo SDK 54 | Кросс-платформа (Android + iOS + Web) |
| Язык | TypeScript | Типобезопасность |
| Роутинг | Expo Router v6 (file-based) | Файловая маршрутизация, deep linking, typed routes |
| Стилизация | NativeWind v4 (Tailwind CSS) | Утилитарные классы для RN |
| State (локальный) | Zustand v5 | Активная тренировка, настройки, без бойлерплейта |
| State (серверный) | TanStack Query v5 | Кэширование, background refetch, optimistic updates |
| Backend | Firebase (Firestore, Auth, Cloud Functions) | Auth, DB, серверная логика |
| Иконки | Ionicons + MaterialCommunityIcons | UI иконки + фитнес-специфичные глифы |
| Графики | react-native-gifted-charts | Линейные и столбчатые графики прогресса |
| Списки | @shopify/flash-list | Производительная виртуализация (87+ упражнений) |
| Валидация | Zod v4 | Runtime type safety для форм и API |
| Дата/время | date-fns | Форматирование дат |
| Анимации | react-native-reanimated v4 | Плавные анимации (Rest Timer progress bar) |
| Bottom sheets | @gorhom/bottom-sheet v5 | Модальные панели |
| AI | @anthropic-ai/sdk (в Cloud Functions) | Claude API для AI-ассистента |
| i18n | i18n-js + expo-localization | Мультиязычность |
| Хранилище | react-native-mmkv | Быстрое локальное хранилище для настроек |
| Haptics | expo-haptics | Тактильная обратная связь |

---

## Структура проекта

```
FitIn/
  app/                              # Expo Router — экраны (42 файла)
    _layout.tsx                     # Root layout: провайдеры, auth gate
    index.tsx                       # Точка входа с редиректом
    (auth)/                         # Группа авторизации
      _layout.tsx
      sign-in.tsx                   # Вход (Email/Password)
      sign-up.tsx                   # Регистрация
      forgot-password.tsx           # Сброс пароля
    (onboarding)/                   # Группа онбординга
      _layout.tsx
      welcome.tsx                   # Приветствие + кнопка "Пропустить"
      personal-info.tsx             # Никнейм, пол, рост, вес, дата рождения
      fitness-goals.tsx             # Цель + уровень опыта
      dietary-preferences.tsx       # Пищевые предпочтения
      summary.tsx                   # Обзор + подтверждение
    (tabs)/                         # Основное приложение (5 табов)
      _layout.tsx                   # Tab bar + FAB AI-ассистента
      index.tsx                     # Dashboard (прогресс, статистика, последняя тренировка)
      workouts/
        _layout.tsx
        index.tsx                   # История тренировок
        new.tsx                     # Новая тренировка
        active.tsx                  # Активная тренировка (логирование подходов, rest timer)
        [id].tsx                    # Детали завершённой тренировки
        stats.tsx                   # Графики прогресса
        exercise-picker.tsx         # Выбор упражнения (поиск, фильтры, иконки)
        exercise-info.tsx           # Детали упражнения (мышцы, инвентарь, инструкция)
        create-exercise.tsx         # Создание кастомного упражнения
      nutrition/
        _layout.tsx
        index.tsx                   # Дневной трекер (калории, макросы, приёмы пищи, вода)
        add-meal.tsx                # Выбор приёма пищи
        food-search.tsx             # Поиск продуктов (API) + кнопка Quick Add
        quick-add.tsx               # Ручной ввод продукта (название, калории, макросы)
      social/
        _layout.tsx
        index.tsx                   # Лента + поиск пользователей + рекомендации
        profile/[userId].tsx        # Публичный профиль + Follow кнопка
        teams/
          index.tsx                 # Список команд
          [teamId].tsx              # Детали команды
          create.tsx                # Создание команды
      profile/
        _layout.tsx
        index.tsx                   # Мой профиль (@username, статистика, меню)
        edit.tsx                    # Редактирование (имя, рост, вес, цели, public/private)
        settings.tsx                # Настройки (язык, единицы, rest timer, уведомления)
    assistant/
      _layout.tsx
      index.tsx                     # AI чат (сообщения, подсказки, rate limit)
    modals/
      _layout.tsx
      workout-complete.tsx          # Модалка итогов тренировки (haptic feedback)

  src/                              # Исходный код (48 файлов)
    components/
      ui/                           # Переиспользуемые UI-компоненты
        Button.tsx                  # Кнопка (primary/secondary/outline/ghost/danger, loading)
        Card.tsx                    # Карточка (pressable, padded)
        Input.tsx                   # Поле ввода (label, error, icon, password toggle)
        DateInput.tsx               # Дата с автоформатом (YYYYMMDD → YYYY-MM-DD)
        UsernameInput.tsx           # Username с live-проверкой доступности
        Avatar.tsx                  # Аватар (изображение или инициалы)
        ProgressBar.tsx             # Прогресс-бар (label, percentage, цвет)
        LoadingSpinner.tsx          # Спиннер загрузки
        EmptyState.tsx              # Пустое состояние (иконка, заголовок, описание, CTA)
      workout/
        RestTimer.tsx               # Таймер отдыха (countdown, +15s/-15s, skip, progress bar)
        SetRow.tsx                  # Строка подхода (адаптивная: strength/bodyweight/cardio/flexibility)
        ProgressChart.tsx           # Линейный график прогресса (react-native-gifted-charts)
    lib/
      firebase/
        config.ts                   # Инициализация Firebase (Auth с AsyncStorage persistence)
        auth.ts                     # Функции авторизации (signUp, signIn, signOut, resetPassword)
        firestore.ts                # CRUD операции (users, workouts, nutrition, follows, username)
        social.ts                   # Социальные запросы (search, feed, suggestions, follow counts)
      api/
        assistant.ts                # Клиент AI-ассистента (Cloud Function caller)
        food.ts                     # Клиент поиска еды (Cloud Function caller)
      utils/
        calculations.ts             # BMR, TDEE, целевые калории, макросы, 1RM, BMI, возраст
    hooks/
      useT.ts                       # Hook для i18n переводов (реактивный на смену локали)
      useDebounce.ts                # Debounce для поиска (300-500ms)
      useWorkouts.ts                # TanStack Query: история тренировок
      useNutrition.ts               # TanStack Query: дневное питание, добавление еды, вода
      useFoodSearch.ts              # TanStack Query: поиск продуктов
      useFollows.ts                 # TanStack Query: follow/unfollow
      useSocial.ts                  # TanStack Query: поиск юзеров, feed, suggestions, public profile
      useExercises.ts               # TanStack Query: кастомные упражнения CRUD
    store/
      authStore.ts                  # Zustand: текущий пользователь
      workoutStore.ts               # Zustand: активная тренировка (упражнения, подходы, таймер)
      settingsStore.ts              # Zustand: локаль, единицы измерения, rest timer default
    types/
      user.ts                       # UserDocument, UserProfile, OnboardingData
      workout.ts                    # WorkoutDocument, ExerciseDocument, WorkoutExercise, ExerciseSet
      nutrition.ts                  # NutritionDayDocument, Meal, FoodEntry, Macros
      social.ts                     # FollowDocument, TeamDocument, TrainerRelation
      assistant.ts                  # ChatMessage, AssistantContext
      health.ts                     # HealthDataDocument
    constants/
      theme.ts                      # Цвета (primary/accent/success/danger/dark), spacing, fontSize
      exercises.ts                  # 87+ seed-упражнений с инструкциями
      muscles.ts                    # MUSCLE_GROUPS (18 групп), EQUIPMENT (13 типов)
      goals.ts                      # FITNESS_GOALS, EXPERIENCE_LEVELS, ACTIVITY_LEVELS, DIETARY
      muscleIcons.ts                # MaterialCommunityIcons + цвета для каждой мышечной группы
    providers/
      AuthProvider.tsx              # Context: user, profile, loading, isOnboarded, refreshProfile
      QueryProvider.tsx             # TanStack Query client (staleTime: 5min, retry: 2)
    i18n/
      index.ts                      # i18n-js инициализация, SUPPORTED_LOCALES, auto-detect
      translations/
        en.ts                       # English (все секции)
        ru.ts                       # Русский (все секции + muscles + equipment)
      exerciseTranslations.ts       # 87+ переводов названий упражнений + инструкции
      helpers.ts                    # translateMuscle(), translateEquipment()

  functions/                        # Firebase Cloud Functions (7 файлов)
    src/
      index.ts                      # Экспорт всех функций
      assistant/
        chat.ts                     # HTTP Callable: Claude API + user context + rate limiting
        context.ts                  # Сборка контекста пользователя для AI
        rateLimiter.ts              # Firestore-based rate limiter (10 req/hour)
      nutrition/
        foodSearch.ts               # HTTP Callable: прокси OpenFoodFacts API
      triggers/
        onUserCreate.ts             # Auth trigger: инициализация user doc
        onWorkoutComplete.ts        # Firestore trigger: обновление stats + детект PR
    package.json                    # Отдельные зависимости (firebase-admin, @anthropic-ai/sdk)
    tsconfig.json

  firestore.rules                   # Правила безопасности Firestore
  firestore.indexes.json            # Композитные индексы
  firebase.json                     # Firebase проект + эмуляторы
  app.json                          # Expo конфигурация
  tailwind.config.js                # NativeWind тема (кастомные цвета, шрифты)
  metro.config.js                   # Metro + withNativeWind
  babel.config.js                   # NativeWind babel preset (jsxImportSource)
  .env.example                      # Шаблон переменных окружения
```

---

## База данных (Firestore)

### Схема коллекций

```
users/{userId}                      # Профиль пользователя
  ├── email, displayName, username, photoURL
  ├── role: 'user' | 'trainer'
  ├── onboardingComplete: boolean
  ├── isPublic: boolean
  ├── profile: { heightCm, weightKg, dateOfBirth, gender, fitnessGoal, experienceLevel, activityLevel, dietaryPreferences[] }
  ├── stats: { totalWorkouts, totalVolume, currentStreak, longestStreak }
  ├── settings: { unitSystem, notifications, healthSyncEnabled }
  ├── /workouts/{workoutId}         # Тренировки
  │     ├── title, status, startedAt, completedAt, durationSeconds, totalVolume
  │     └── exercises[]: { exerciseId, exerciseName, muscleGroup, category, order, sets[] }
  ├── /nutritionDays/{YYYY-MM-DD}   # Дневное питание
  │     ├── targetCalories, targetProtein, targetCarbs, targetFat
  │     ├── meals[]: { id, name, type, time, foods[] }
  │     ├── totals: { calories, protein, carbs, fat, fiber }
  │     └── waterMl
  ├── /personalRecords/{exerciseId} # Личные рекорды (пишут только Cloud Functions)
  ├── /customExercises/{id}         # Кастомные упражнения
  ├── /assistantChats/{chatId}      # История AI чатов
  └── /healthData/{YYYY-MM-DD}      # Данные здоровья (HealthKit/Health Connect)

exercises/{exerciseId}              # Глобальная база упражнений (read-only)

usernames/{username}                # Уникальные никнеймы → userId

follows/{followerId_followingId}    # Подписки

teams/{teamId}                      # Команды
  ├── /members/{userId}
  └── /messages/{messageId}

trainerRelations/{relationId}       # Связи тренер-клиент
  ├── trainerId, clientId, status
  └── permissions: { viewWorkouts, modifyWorkoutPlans, viewNutrition }

rateLimits/{userId}                 # Rate limiting для AI (Cloud Functions)
```

### Правила безопасности

- **Изоляция данных**: пользователь читает/пишет только свои subcollections
- **Публичные профили**: `isPublic == true` разрешает чтение другими
- **Тренер-клиент**: транзакционная модель с гранулярными правами
- **Команды**: чтение сообщений только для участников
- **Username**: create разрешён если `userId == request.auth.uid`, delete — только владельцу
- **Упражнения**: глобальная коллекция read-only (seed через скрипт)
- **Personal Records**: пишут **только** Cloud Functions

### Композитные индексы

- `workouts`: `status ASC + startedAt DESC`
- `follows`: `followerId ASC + createdAt DESC` / `followingId ASC + createdAt DESC`
- `teams`: `isPublic ASC + memberCount DESC`
- `trainerRelations`: `clientId + status` / `trainerId + status`

---

## Установка и запуск

### Требования

- Node.js v18+
- npm v9+
- Expo Go на телефоне (Android / iOS) — или Android Studio / Xcode для эмулятора

### 1. Клонирование и установка

```bash
git clone <repo-url>
cd FitIn
npm install
```

### 2. Настройка Firebase

1. Создай проект на https://console.firebase.google.com
2. Добавь **Web-приложение** (иконка `</>` в Project Overview)
3. Включи **Authentication** → Sign-in method → Email/Password
4. Создай **Firestore Database** → Production mode → выбери регион
5. Скопируй конфиг в `.env`:

```bash
cp .env.example .env
# Заполни значениями из Firebase Console
```

### 3. Деплой Firestore правил и индексов

```bash
npm install -g firebase-tools
firebase login
firebase use --add   # выбери свой проект
firebase deploy --only firestore:rules,firestore:indexes
```

> ⚠️ Индексы **обязательно** надо задеплоить — без collectionGroup-индекса на `members.userId` пункт "Мои команды" будет пустым. После деплоя индексы собираются 1-2 минуты, статус виден в Firebase Console → Firestore → Indexes.

### 4. Запуск dev-сервера

```bash
npx expo start -c
```

Флаг `-c` очищает кэш Metro (рекомендуется после установки/обновления пакетов).

### 5. Подключение устройства

| Способ | Как |
|--------|-----|
| **Expo Go** (рекомендуется) | Скачай Expo Go из App Store / Google Play, отсканируй QR |
| **Web** | Нажми `w` в терминале Expo |
| **Android эмулятор** | Нажми `a` (нужен Android Studio + SDK) |
| **iOS симулятор** | Нажми `i` (только macOS + Xcode) |
| **Tunnel** | Нажми `s` → переключит на Tunnel mode (через интернет, если Wi-Fi блокирует) |

### 6. Cloud Functions (опционально, нужен Blaze plan)

```bash
cd functions
npm install
firebase functions:secrets:set ANTHROPIC_API_KEY   # ключ с console.anthropic.com
firebase deploy --only functions
```

Без Cloud Functions:
- AI-ассистент покажет ошибку при отправке — используй **Quick Add** для еды
- Всё остальное (тренировки, питание, соцсеть) работает

---

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm start` | Запуск Expo dev server |
| `npx expo start -c` | Запуск с очисткой кэша Metro |
| `npm run android` | Запуск на Android |
| `npm run ios` | Запуск на iOS (требует macOS) |
| `npm run web` | Запуск в браузере |
| `npm run lint` | Линтинг (ESLint) |
| `npm test` | Jest unit-тесты (BMR/TDEE/1RM и др.) |
| `npm run typecheck` | Проверка типов TypeScript |
| `firebase deploy --only firestore:rules,firestore:indexes` | Деплой Firestore правил + индексов |
| `firebase deploy --only functions` | Деплой Cloud Functions |
| `eas build --profile preview --platform android` | Сборка `.apk` через EAS (preview-профиль) |
| `eas build --profile production --platform all` | Production-сборка для обеих платформ |

---

## Тесты и проверки качества

Перед коммитом прогоняй полный набор:

```bash
npm run typecheck   # tsc --noEmit
npm test            # Jest
npm run lint        # ESLint
cd functions && npx tsc --noEmit && cd ..
```

Что покрыто прямо сейчас:

- **Unit (Jest)**: `src/lib/utils/calculations.ts` — формулы BMR (Миффлин-Сан-Жеор), TDEE, target calories, макросы, возраст, 1RM (Epley), BMI.
- **Type safety**: strict TypeScript в `app/`, `src/` и `functions/` — 0 ошибок.
- **Lint**: ESLint с конфигом Expo.
- **Error Boundary**: глобальный wrapper в `app/_layout.tsx` показывает recoverable fallback вместо белого экрана при крашах.

Запланировано: e2e через Maestro, RN Testing Library для компонентов, GitHub Actions CI.

---

## EAS Build

В корне есть `eas.json` с тремя профилями:

- **`development`** — dev-client с `expo-dev-client`, internal distribution, `.apk` для Android.
- **`preview`** — internal-сборка для тест-полётов, `.apk` для Android, store-style для iOS.
- **`production`** — production builds для Google Play / App Store с `autoIncrement: true`.

```bash
npm install -g eas-cli
eas login
eas build:configure       # один раз — привязать проект
eas build --profile preview --platform android
```

---

## Архитектура

### Auth Gate

`app/_layout.tsx` маршрутизирует по состоянию авторизации:

```
Не авторизован ──→ (auth)/sign-in
Авторизован, анкета не заполнена ──→ (onboarding)/welcome
Авторизован, анкета заполнена ──→ (tabs)
```

Если user doc отсутствует в Firestore (например, создан до деплоя правил), `AuthProvider` **автоматически создаст** его с дефолтами.

### State Management

```
Zustand (локальное)                  TanStack Query (серверное)
┌─────────────────┐                  ┌─────────────────────┐
│ workoutStore    │ ← активная       │ useWorkoutHistory   │ ← Firestore
│   exercises[]   │    тренировка    │ useNutritionDay     │
│   sets[]        │                  │ useFoodSearch       │
│   restTimer     │                  │ useFollows          │
├─────────────────┤                  │ useSocial           │
│ settingsStore   │ ← locale,       │ useExercises        │
│   locale        │    единицы,     └─────────────────────┘
│   unitSystem    │    rest timer
│   restTimerDefault│
└─────────────────┘
```

### AI Assistant Pipeline

```
Client (chat UI)
  │
  ▼ httpsCallable('assistantChat')
Cloud Function
  ├── Rate limit check (Firestore rateLimits/{userId})
  ├── Build user context (profile, workouts, nutrition, PRs)
  ├── Construct system prompt with context
  ├── Call Claude Sonnet 4.6 via @anthropic-ai/sdk
  ├── Save messages to Firestore
  └── Return response + remaining quota
```

### Exercise Set Adaptation

```
ExerciseCategory   Поля подхода          Пример
───────────────────────────────────────────────────
strength           КГ + ПОВТОРЕНИЯ       80kg × 8
bodyweight         +КГ + ПОВТОРЕНИЯ      +10kg × 12  (или пусто × 20)
cardio             ВРЕМЯ + ДИСТАНЦИЯ     25:00 × 5km
flexibility        ВРЕМЯ                 60 sec
```

---

## Статус разработки

| Фаза | Статус | Описание |
|------|--------|----------|
| Phase 0 | ✅ Готово | Скаффолдинг, NativeWind, Firebase, структура |
| Phase 1 | ✅ Готово | Auth (Email/Password), онбординг (skip, username, auto-date) |
| Phase 2 | ✅ Готово | Тренировки, упражнения, подходы, PR, rest timer, графики |
| Phase 3 | ✅ Готово | Питание, калории, макросы, поиск еды, Quick Add, вода |
| Phase 4 | ✅ Готово | Соцсеть, follow, лента, поиск, рекомендации, команды (UI) |
| Phase 5 | ⏳ Запланировано | HealthKit (iOS) + Health Connect (Android) — нужен dev build |
| Phase 6 | ✅ Готово | AI-ассистент (Cloud Function + Claude API + chat UI) |
| Phase 7 | 🔶 В процессе | Полировка: полный RU перевод, иконки, адаптивные сеты |

### Запланированные улучшения

- Push-уведомления (FCM)
- Team chat с realtime listeners
- Trainer-client UI для управления правами
- Barcode scanner для еды
- E2E тесты
- Lottie-анимации
- Dark mode
- Деплой в App Store / Google Play (EAS Build)

---

## Метрики проекта

- **90 TypeScript файлов** (42 экрана + 48 src)
- **87+ встроенных упражнений** с русскими переводами
- **7 Cloud Functions** (AI, food search, triggers)
- **2 языка** (English + Русский), полный перевод
- **6 Firestore коллекций** с композитными индексами
- **0 ошибок TypeScript**, все экраны собираются Metro bundler

---

## Contributing

PR и issue приветствуются. Перед PR:

1. Сделай форк и создай ветку: `git checkout -b feat/your-feature`
2. Прогон `npm run typecheck && npm test && npm run lint` — должно быть 0 ошибок
3. Делай атомарные коммиты с осмысленными сообщениями
4. В PR опиши **что** и **зачем** — а не "fixed bug"

Для крупных изменений сначала открой issue, чтобы обсудить подход.

---

## Лицензия

[MIT](LICENSE) © 2025 FitIn contributors.

Можешь свободно использовать, форкать, изменять и распространять. Только сохраняй копирайт-нотис в производных работах.
