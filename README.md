# Universal Table Component

Универсальный компонент таблицы с поддержкой:
- Автоматической генерации колонок
- Сортировки
- Фильтрации
- Группировки
- Виртуализации
- Drag-and-drop
- Изменения размеров колонок
- Закрепления колонок
- Экспорта данных

## Установка

```bash
npm install @your-org/universal-table
```

## Основные возможности

1. Автоматическая генерация колонок из данных
2. Поддержка кастомных колонок
3. Виртуализация для большого объема данных
4. Сохранение состояния таблицы
5. Различные типы фильтров
6. Поддержка группировки данных
7. Экспорт в Excel и CSV
8. Drag-and-drop для колонок
9. Изменение размеров колонок
10. Закрепление колонок

## Быстрый старт

```typescript
import { UniversalTable } from '@your-org/universal-table';
import { YourStore } from './your-store';

const TableComponent = observer(() => {
  const store = useStore(YourStore);

  return (
    <UniversalTable
      store={store}
      onSortChange={(sortColumns) => {
        store.SortColumns = sortColumns;
      }}
      onFilterChange={(filters) => {
        store.Filters = filters;
      }}
    />
  );
});
```

## Store Interface

Ваш store должен реализовывать следующий интерфейс:

```typescript
interface TableStore<T> {
  Data: T[];
  IsLoading: boolean;
  Filters: Partial<Record<keyof T, string>>;
  SortColumns: Array<{ columnKey: keyof T; direction: 'ASC' | 'DESC' }>;
  FilteredData: T[];
  SortedFilteredData: T[];
}
```

## Кастомные колонки

```typescript
const customColumns = [
  {
    accessorKey: 'id',
    header: '№',
    size: 80,
    enableGrouping: false,
  },
  {
    accessorKey: 'name',
    header: 'Наименование',
    size: 200,
    cell: (props) => (
      <div style={{ fontWeight: 500 }}>
        {props.getValue()}
      </div>
    ),
  },
];

<UniversalTable
  store={store}
  customColumns={customColumns}
/>
```

## Фильтры

Доступны следующие типы фильтров:
- TextFilter
- NumberFilter
- DateFilter
- SelectFilter

```typescript
import { TextFilter, NumberFilter, DateFilter, SelectFilter } from '@your-org/universal-table';

const columnWithFilter = {
  accessorKey: 'status',
  header: 'Статус',
  filterComponent: (props) => (
    <SelectFilter
      value={props.value}
      options={['Active', 'Inactive']}
      onChange={props.onChange}
    />
  ),
};
```

## События

```typescript
<UniversalTable
  store={store}
  onSortChange={(sortColumns) => {
    // Обработка изменения сортировки
  }}
  onFilterChange={(filters) => {
    // Обработка изменения фильтров
  }}
  onGroupingChange={(grouping) => {
    // Обработка изменения группировки
  }}
  onColumnResize={(columnId, width) => {
    // Обработка изменения размера колонки
  }}
/>
```

## Стилизация

Компонент использует CSS-модули и может быть кастомизирован через переопределение классов или через пропсы className.

## Дополнительные компоненты

1. TableToolbar - панель инструментов
2. ExportMenu - меню экспорта
3. SettingsPanel - панель настроек
4. LoadingIndicator - индикатор загрузки
5. NoData - компонент для отображения пустого состояния
6. ErrorBoundary - обработка ошибок

## Примеры использования

См. файл examples.md для более подробных примеров использования.

## Производительность

- Виртуализация строк для оптимальной производительности
- Ленивая загрузка компонентов
- Оптимизация ререндеров
- Кэширование вычисляемых значений

## Contributing

Пожалуйста, ознакомьтесь с CONTRIBUTING.md для получения информации о том, как внести свой вклад в проект.

## License

MIT