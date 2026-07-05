import { expect, test } from '@jest/globals';
import { ingredientsSlice, initialState } from '../ingredientsSlice';
import { getIngredients } from '../../services/middlewares/getIngredients';

const reducer = ingredientsSlice.reducer;

const mockIngredient1 = {
  _id: '1',
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
  _id: '2',
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

const mockIngredient3 = {
  _id: '3',
  name: 'Капуста',
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

describe('тестирование ingredientsSlice', () => {
  test('pendig - должен изменить состояние isLoading', () => {
    const state = reducer(initialState, { type: getIngredients.pending.type });
    expect(state.isLoading).toBe(true);
  });
  test('fulfilled - должен получить массив ингредиентов и остановить загрузку', () => {[]
    const mockData = [{...mockIngredient1}]
    const state = reducer(
      initialState, 
      { 
        type: getIngredients.fulfilled.type, 
        payload: mockData 
      }
    );

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual([{...mockIngredient1}])
  });
  test('rejected - должен выдать ошибку и остановить загрузку', () => {
    const state = reducer(initialState, { type: getIngredients.rejected.type });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки ингредиентов.')
  })
})
