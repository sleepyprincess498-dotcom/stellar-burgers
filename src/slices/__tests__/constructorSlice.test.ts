import { expect, test } from '@jest/globals';
import { constructorSlice, initialState } from '../constructorSlice';

const reducer = constructorSlice.reducer;
const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
} = constructorSlice.actions;

const mockBun = {
  _id: '1',
  name: 'Булка',
  type: 'bun',
  price: 100,
  proteins: 300,
  fat: 300,
  carbohydrates: 300,
  calories: 300,
  image: 'string',
  image_large: 'string',
  image_mobile: 'string'
};

const mockIngredient1 = {
  _id: '2',
  name: 'Соус',
  type: 'sauce',
  price: 50,
  proteins: 300,
  fat: 300,
  carbohydrates: 300,
  calories: 300,
  image: 'string',
  image_large: 'string',
  image_mobile: 'string'
};

const mockIngredient2 = {
  _id: '3',
  name: 'Котлета',
  type: 'main',
  price: 200,
  proteins: 300,
  fat: 300,
  carbohydrates: 300,
  calories: 300,
  image: 'string',
  image_large: 'string',
  image_mobile: 'string'
};

describe('тестирование constructorSlice', () => {
  test('должен вернуть initialState при неизвестном экшене', () => {
    const state = reducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });
  test('addBun - должен добавить булку', () => {
    const startState = {...initialState, bun: null};
    const state = reducer(startState, addBun(mockBun));

    expect(state.bun).toEqual(mockBun);
  });
  test('addIngredient - должен добавить ингредиент', () => {
    const startState = { ...initialState, ingredients: [] };
    const action = addIngredient({ ingredient: mockIngredient1, id: '1' });
    const state = reducer(startState, action);

    expect(state.ingredients).toEqual([{ ...mockIngredient1, id: '1' }]);
  });
  test('removeIngredient - должен удалить ингредиент', () => {
    const startState = {
      ...initialState,
      ingredients: [
        {
          ...mockIngredient1,
          id: '1'
        }
      ]
    }
    const state = reducer(startState, removeIngredient('1'));
    expect(state.ingredients).toEqual([])
  });
  test('moveIngredientUp - должен переместить ингредиент выше в списке', () => {
    const startState = {
      ...initialState,
      ingredients: [
        { ...mockIngredient1, id: '1' },
        { ...mockIngredient2, id: '2' },
      ],
    };

    const state = reducer(startState, moveIngredientDown(0));

    expect(state.ingredients[0].id).toBe('2');
    expect(state.ingredients[1].id).toBe('1');
  });
  test('moveIngredientDown - должен переместить ингредиент ниже в списке', () => {
    const startState = {
      ...initialState,
      ingredients: [
        { ...mockIngredient1, id: '1' },
        { ...mockIngredient2, id: '2' },
      ],
    };

    const state = reducer(startState, moveIngredientDown(1));

    expect(state.ingredients[0].id).toBe('1');
    expect(state.ingredients[1].id).toBe('2');
  });
  test('clearConstructor - должен очистить список ингредиентов', () => {
    const startState = {
      bun: mockBun,
      ingredients: [
        {...mockIngredient1, id: '1'},
        {...mockIngredient2, id: '2'}
      ]
    };
    const state = reducer(startState, clearConstructor());

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
  })
})
