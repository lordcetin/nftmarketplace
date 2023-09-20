import { createSlice } from '@reduxjs/toolkit';

export const todoSlice = createSlice({
    name: 'todos', // ► Slice'ın ismi.
    initialState: [
      // ► Burada başlangıç değerini yazıyoruz. Default olarak initialState obje döndürür. Bir todo listesi oluşturacağımız için birden fazla objeye ihtiyacımız olacak bu nedenle initialState'i obje dizisi olarak döndürüyoruz. Ve objelerimizi bu diziye aktarıyoruz.
  
      {id: 1, title: 'Todo 1', completed: false},
      {id: 2, title: 'Todo 2', completed: false},
      {id: 3, title: 'Todo 3', completed: false},
  
    ],
    reducers: {
      // ► Burada reducer fonksiyonumuzun ne yapması gerektiğini yazıyoruz. Reducer actiona yanıt verir, mevcut state'i alır ve action payloadına göre yeni state oluşturur.
  
      addTodo: (state, action) => {
      // ► action objesinden action.payload diyerek payload bilgisini çekebiliriz artık.
          const todo = {
              id: new Date().getTime(),
              title: action.payload.title,
              completed: false
          }
          state.push(todo);
      }
    }
  });
  
  export const { addTodo } = todoSlice.actions;
  export default todoSlice.reducer;