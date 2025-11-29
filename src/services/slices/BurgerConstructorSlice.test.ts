import reducer, {
  addIngredient,
  removeIngredient,
  moveDownIngredient,
  moveUpIngredient,
  constructorInitialState
} from './BurgerConstructorSlice';

// Создаем тестовые данные
const mockBun = () => ({
  id: '1',
  _id: '1',
  name: 'Фиолетовая булочка',
  type: 'bun',
  proteins: 15,
  fat: 16,
  carbohydrates: 17,
  calories: 100,
  price: 1000,
  image: 'https://code.s3.yandex.net/react/code/bun-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
});

const mockMain = () => ({
  id: '2',
  _id: '2',
  name: 'Синяя котлета',
  type: 'main',
  proteins: 25,
  fat: 26,
  carbohydrates: 27,
  calories: 200,
  price: 2000,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
});

const mockSauce = () => ({
  id: '3',
  _id: '3',
  name: 'Соус голубенький',
  type: 'sauce',
  proteins: 35,
  fat: 36,
  carbohydrates: 37,
  calories: 300,
  price: 3000,
  image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png'
});

describe('Проверка экшена добавления ингредиентов', () => {
  test('Добавляем булочку', () => {
    const newState = reducer(
      constructorInitialState,
      addIngredient(mockBun())
    );
    const bun = newState.constructor.bun;
    expect(bun).toEqual({
      id: expect.any(String),
      _id: '1',
      name: 'Фиолетовая булочка',
      type: 'bun',
      proteins: 15,
      fat: 16,
      carbohydrates: 17,
      calories: 100,
      price: 1000,
      image: 'https://code.s3.yandex.net/react/code/bun-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
    });
  });

  test('Добавляем основной ингредиент', () => {
    const newState = reducer(
      constructorInitialState,
      addIngredient(mockMain())
    );
    const main = newState.constructor.ingredients;
    expect(newState.constructor.bun).toBeNull();
    expect(main).toHaveLength(1);
    expect(main).toEqual([{
      id: expect.any(String),
      _id: '2',
      name: 'Синяя котлета',
      type: 'main',
      proteins: 25,
      fat: 26,
      carbohydrates: 27,
      calories: 200,
      price: 2000,
      image: 'https://code.s3.yandex.net/react/code/meat-03.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
    }]);
  });

  test('Добавляем соус', () => {
    const newState = reducer(
      constructorInitialState,
      addIngredient(mockSauce())
    );
    const souse = newState.constructor.ingredients;
    expect(newState.constructor.bun).toBeNull();
    expect(souse).toHaveLength(1);
    expect(souse).toEqual([{
      id: expect.any(String),
      _id: '3',
      name: 'Соус голубенький',
      type: 'sauce',
      proteins: 35,
      fat: 36,
      carbohydrates: 37,
      calories: 300,
      price: 3000,
      image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png'
    }]);
  });
});

describe('Проверка экшена удаления ингредиентов', () => {
  const startState = {
    ...constructorInitialState,
    constructor: {
      bun: mockBun(),
      ingredients: [
        { ...mockMain()},
        { ...mockSauce()}
      ]
    }
  };

  test('Удаляем основной ингредиент', () => {
    const newState = reducer(
      startState,
      removeIngredient({ id: '2' })
    );

    expect(newState.constructor.ingredients).toHaveLength(1);
    expect(newState.constructor.ingredients[0].name).toBe('Соус голубенький');
    expect(newState.constructor.bun!.name).toBe('Фиолетовая булочка');
  });

  test('Удаляем соус', () => {
    const newState = reducer(
      startState,
      removeIngredient({ id: '3' })
    );

    expect(newState.constructor.ingredients).toHaveLength(1);
    expect(newState.constructor.ingredients[0].name).toBe('Синяя котлета');
    expect(newState.constructor.bun!.name).toBe('Фиолетовая булочка');
  });

  test('Удаляем несуществующий ингредиент', () => {
    const newState = reducer(
      startState,
      removeIngredient({ id: '' })
    );

    expect(newState.constructor.ingredients).toHaveLength(2);
    expect(newState.constructor.bun!.name).toBe('Фиолетовая булочка'); // ничего не изменилось
  });
});

describe('Проверка экшена изменения порядка ингредиентов', () => {
  const startState = {
    ...constructorInitialState,
    constructor: {
      bun: mockBun(),
      ingredients: [
        { ...mockMain()},
        { ...mockMain(), id: '4', name: 'Рыба'},
        { ...mockSauce()}
      ]
    }
  };

  test('Перемещаем ингредиент вниз', () => {
    const newState = reducer(
      startState,
      moveDownIngredient(0) // Перемещаем первый элемент вниз
    );

    expect(newState.constructor.ingredients.map(ing => ing.name)).toEqual([
      'Рыба',
      'Синяя котлета',
      'Соус голубенький'
    ]);
  });

  test('Перемещаем ингредиент вверх', () => {
    const newState = reducer(
      startState,
      moveUpIngredient(2) // Перемещаем последний элемент вверх
    );

    expect(newState.constructor.ingredients.map(ing => ing.name)).toEqual([
      'Синяя котлета',
      'Соус голубенький',
      'Рыба'
    ]);
  });

  test('Булочка не изменяется при перемещении ингредиентов', () => {
    const newState = reducer(
      startState,
      moveDownIngredient(1)
    );

    expect(newState.constructor.bun!.name).toBe('Фиолетовая булочка');
    expect(newState.constructor.bun!.price).toBe(1000);
  });
});
