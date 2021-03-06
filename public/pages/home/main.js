import {
  createPost, watchPosts, logout, deletePost, editPost, updateLike, editPrivacy,
} from './data.js';

export default () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      firebase.firestore().collection('users').where('uid', '==', firebase.auth().currentUser.uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const nameFirestore = doc.data().name;
            const minibioFirestore = doc.data().minibio;
            const profileImageFirestore = doc.data().profileimage;
            const coverImageFirestore = doc.data().coverimage;
            showData(nameFirestore, minibioFirestore, profileImageFirestore, coverImageFirestore);
          });
        });
    }
  });

  const container = document.createElement('div');
  function showData(nameUser, miniBioUser, profileImageCurrent, coverImageCurrent) {
    const template = `
      <header>
        <img class="btn-menu" src="img/menu.png">
        <ul class="menu" id="menu">
          <li class="menu-item" id= "menu-item-profile">Perfil</a></li>
          <li class="menu-item" id=sign-out>Sair</li>
        </ul>
        <img class="header-logo" src="img/LOGO-SH-SITE2.png" alt="Logo SafeHome">
      </header>
      <section class="home-page flex-column">
        <div class="profile-box" id="profile-box">
          <div class="profile-cover-profile cover-home-mobile"></div>
          <div class="profile-content">
            <img class="user-photo" src="${profileImageCurrent}">
            <div class="pb-info" id="pb-info">
            <p class = "user-name" >${nameUser}</p>
            <p>${miniBioUser}</p>
            </div>
          </div>
        </div>
        <div class="feed flex-column">
          <div class="create-post-box flex-column" id="create-post">
            <textarea style="resize: none" class="create-post-input" id="create-post-input" rows="5" placeholder="Como você está se sentindo?"></textarea>
            <div class="create-post-btns">
              <button type="submit" class="post-btn" id="post-btn">Postar</button>
            </div>
          </div>
          <div class="posts-container" id="posts-container"></div>
        </div>
      </section>
    `;
    container.innerHTML = template;
    container.querySelector('.profile-cover-profile').style.backgroundImage = `url("${coverImageCurrent}")`;

    const clearPosts = () => postContainer.innerHTML = '';
    const postBtn = container.querySelector('#post-btn');
    const postContainer = container.querySelector('#posts-container');
    const textPost = container.querySelector('#create-post-input');

    const displayPost = (newPost) => {
      const postTemplate = document.createElement('div');
      postTemplate.classList.add('post');
      postTemplate.classList.add('flex-column');
      postTemplate.innerHTML = `
        <div class = "color-post template-post position-post">
          <div class = "post-top">
            <span class="name-post">${newPost.data().name}</span>
            <img id="privacy-btn"  data-id = "${newPost.id}" class = "icons" src="./img/privacy.svg" alt = "Post Privado" />
            <img id="public-btn"  data-id = "${newPost.id}" class = "icons" src="./img/public.svg" alt = "Post Publico" />
          </div>
          <img
            class = "icons"
            src = "./img/delete.svg"
            alt = "Deletar Post"
            id = "delete-btn"
            data-id = "${newPost.id}"
          />
        </div>
        <div class="template-post post-middle">
          <textarea disabled style="resize: none" rows="4" class="edit-post-input" 
            id="text-post" data-id="${newPost.id}"> ${newPost.data().text}
          </textarea>
        </div>
        <div class = "color-post template-post position-post">
          <div class = "position-post">
            <img class = "icons" src = "./img/like.svg" alt = "Like" 
            id="like" data-id="${newPost.id}"/>
            <span class="name-post">${newPost.data().likes.length}</span>
          </div>
          <img id = "edit-btn" data-id="${newPost.id}" class = "icons icon-edit" 
            src = "./img/edit.svg" alt = "Editar Post" />
          <img id="save-edit-btn" data-id="${newPost.id}" class="hide save-icon" 
            src="./img/checkmark.svg" alt = "Salvar edição"/>
        </div>
      </div>
      `;
      postContainer.appendChild(postTemplate);

      const deleteBtn = postTemplate.querySelector(`#delete-btn[data-id="${newPost.id}"]`);
      const editBtn = postTemplate.querySelector(`#edit-btn[data-id="${newPost.id}"]`);
      const saveEditBtn = postTemplate.querySelector(`#save-edit-btn[data-id="${newPost.id}"]`);
      const editInput = postTemplate.querySelector(`#text-post[data-id="${newPost.id}"]`);
      const privacyBtn = postTemplate.querySelector(`#privacy-btn[data-id="${newPost.id}"]`);
      const publicBtn = postTemplate.querySelector(`#public-btn[data-id="${newPost.id}"]`);
      const likeBtn = postTemplate.querySelector(`#like[data-id="${newPost.id}"]`);

      const validateUser = () => {
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            if (newPost.data().user !== firebase.auth().currentUser.uid) {
              deleteBtn.style.display = 'none';
              editBtn.style.display = 'none';
            } else {
              deleteBtn.style.display = 'inline-block';
              editBtn.style.display = 'inline-block';
            }
          }
        });
      };
      validateUser();

      const privacyIcon = () => {
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            if (newPost.data().user !== firebase.auth().currentUser.uid) {
              privacyBtn.style.display = 'none';
              publicBtn.style.display = 'none';
            } else if (newPost.data().user === firebase.auth().currentUser.uid
              && newPost.data().privacy === true) {
              privacyBtn.style.display = 'inline-block';
              publicBtn.style.display = 'none';
            } else {
              privacyBtn.style.display = 'none';
              publicBtn.style.display = 'inline-block';
            }
          }
        });
      };
      privacyIcon();

      editBtn.addEventListener('click', (event) => {
        event.preventDefault();
        saveEditBtn.style.display = 'inline-block';
        editBtn.style.display = 'none';
        editInput.removeAttribute('disabled');
      });

      saveEditBtn.addEventListener('click', (event) => {
        event.preventDefault();
        const editId = saveEditBtn.dataset.id;
        const editPostValue = editInput.value;
        clearPosts();
        editPost(editId, editPostValue);
        saveEditBtn.style.display = 'none';
        editBtn.style.display = 'inline-block';
        editInput.setAttribute('disabled', true);
      });

      deleteBtn.addEventListener('click', (event) => {
        event.preventDefault();
        const deleteId = deleteBtn.dataset.id;
        clearPosts();
        deletePost(deleteId);
      });

      const privacy = () => {
        const id = privacyBtn.dataset.id;
        const db = newPost.data().privacy;
        clearPosts();
        if (db === true) {
          editPrivacy(id, false);
        } else {
          editPrivacy(id, true);
        }
      };

      privacyBtn.addEventListener('click', (event) => {
        event.preventDefault();
        privacy();
      });

      publicBtn.addEventListener('click', (event) => {
        event.preventDefault();
        privacy();
      });

      likeBtn.addEventListener('click', (event) => {
        event.preventDefault();
        const likeId = likeBtn.dataset.id;
        if (newPost.data().user !== firebase.auth().currentUser.uid) {
          clearPosts();
          if (newPost.data().likes.includes(firebase.auth().currentUser.uid)) {
            const removeUid = firebase.firestore.FieldValue
              .arrayRemove(firebase.auth().currentUser.uid);
            updateLike(likeId, removeUid);
          } else {
            const pushUid = firebase.firestore.FieldValue
              .arrayUnion(firebase.auth().currentUser.uid);
            updateLike(likeId, pushUid);
          }
        }
      });
    };
    postBtn.addEventListener('click', (event) => {
      event.preventDefault();
      const post = {
        user: firebase.auth().currentUser.uid,
        name: firebase.auth().currentUser.displayName,
        text: textPost.value,
        likes: [],
        privacy: true,
        date: new Date(),
      };
      clearPosts();
      createPost(post);
      textPost.value = '';
    });
    watchPosts(displayPost);

    container.querySelector('#sign-out').addEventListener('click', (event) => {
      event.preventDefault();
      logout();
    });

    container.querySelector('#menu-item-profile').addEventListener('click', (event) => {
      event.preventDefault();
      window.location.hash = 'profile';
    });

    const closeMenu = () => {
      container.querySelector('.btn-menu').classList.remove('hide');
      container.querySelector('.menu').classList.remove('menu-items-show');
    };
    container.querySelector('.btn-menu').addEventListener('click', (event) => {
      event.preventDefault();
      container.querySelector('.btn-menu').classList.toggle('hide');
      container.querySelector('.menu').classList.toggle('menu-items-show');
      setTimeout(closeMenu, 5000);
    });
  }
  return container;
};
