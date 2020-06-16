import { createPost, watchPosts, logout } from './data.js';
export default () => {
  const container = document.createElement('div');
  const template = ` 
    <header>
      <img class="btn-menu" src="img/menu.png">
      <ul class="menu" id="menu">
        <li class="menu-item" id= "menu-item-profile">Perfil</a></li>
        <li class="menu-item" id=sign-out>Sair</li>
      </ul>
      <img class="header-logo" src="img/LOGO-SH-SITE2.png" alt="Logo SafeHome">
    </header>
    <section class="home-page">
      <div class="profile-box" id="profile-box">
        <img class="user-cover-img" src="img/cover-img.jpg">
        <div class="profile-content">
          <img class="user-photo" src="img/mimi.png">
          <div class="pb-info" id="pb-info">
            <p class="user-name">Amanda</p>
            <p class="user-bio">Estudante da Lab</p>
          </div>
        </div>
      </div>
      <div class="feed">
        <div class="create-post-box" id="create-post">
          <textarea class="create-post-input" id="create-post-input" rows="5" placeholder="Como você está se sentindo?"></textarea>
          <div class="create-post-btns">
            <button class="upload-img-btn" id="upload-img-btn"><img class="upload-img-icon" src="img/picture.png"></button>
            <button type="submit" class="post-btn" id="post-btn">Postar</button>
          </div>
        </div>
        <div class="posts-container" id="posts-container"></div>
      </div>
    </section>
  `;
  container.innerHTML= template

  const postBtn = container.querySelector("#post-btn");
  const postContainer = container.querySelector("#posts-container");
  
  const displayPost = (newPost)=>{
    const postArea = `
      <div id="${newPost.id}">
        <p>${newPost.data().text}</p>
      </div>
    `;
    postContainer.innerHTML += postArea

  }

  postBtn.addEventListener("click", (event)=>{
    event.preventDefault()
    const textPost = container.querySelector("#create-post-input");
    const post = {
      user: firebase.auth().currentUser.uid,
      text: textPost.value,
      likes: 0,
      comments: [],
    };
    postContainer.innerHTML = "";
    createPost(post)
    textPost.value="";
  })

  watchPosts(displayPost)

  container.querySelector("#sign-out").addEventListener("click", (event) =>{
    event.preventDefault()
    logout();
  })

  container.querySelector("#menu-item-profile").addEventListener("click",(event)=>{
    event.preventDefault()
    window.location.hash = "profile"
  });

  container.querySelector(".btn-menu").addEventListener("click",(event)=>{
    event.preventDefault()
    container.querySelector(".btn-menu").classList.toggle("hide")
    container.querySelector(".menu").classList.toggle("menu-items-show")
  });
  container.addEventListener("click",(event)=>{
    event.preventDefault()
    if (!event.target.matches(".btn-menu")) {
      container.querySelector(".btn-menu").classList.remove("hide");
      container.querySelector(".menu").classList.remove("menu-items-show");
    };
  });
  return container;
};
