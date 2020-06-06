// Aqui serão criados os eventos de Manipulação de DOM e templates
import { greeting } from './data.js';


export const home = () => {
  const container = document.createElement('div');

  container.innerHTML = `
    <form>
      <input id='name' type='text'>
      <button id='greeting-btn'>Dizer Oi</button>
    </form>
    <div id='greeting-message'></div>
  `;

  const name = container.querySelector('#name');
  const greetingBtn = container.querySelector('#greeting-btn');
  const greetingMessage = container.querySelector('#greeting-message');

  greetingBtn.addEventListener('click', (event) => {
    event.preventDefault();
    greetingMessage.innerHTML = greeting(name.value);
  });

  return container;
<<<<<<< HEAD
}
=======
};
*/

// firebase
//   .auth()
//   .createUserWithEmailAndPassword(email, password)
//   .catch(function(error) {
//   // Handle Errors here.
//   var errorCode = error.code;
//   var errorMessage = error.message;
//   // ...
// });
>>>>>>> c8ec674009ccc4226c73646f222f943c1ebcc38b
