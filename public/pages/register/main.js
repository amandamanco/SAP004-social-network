import {getCredentials,
        linkUser,
        recordUserToBase
        } from './data.js';

export default () =>{
    const container = document.createElement("div");
    container.className = "login-page";
    const template = `
        <img class="logo" src="img/LOGO-SH-SITE6.png" alt="Safe Home Logo">
        <div class="login-container">
            <img class="logotype" src="img/LOGO-SH-SITE.png" alt="Safe Home Logotype">
            <input type="text" class="login-input" id = "user-name" placeholder="Nome">
            <input type="email" class="login-input" id = "user-email" placeholder="Email">
            <input type="password" class="login-input" id = "user-password" placeholder="Senha">
            <input type="password" class="login-input" id = "user-password-confirm" placeholder="Confirme sua senha">
            <button class="login-btn" id="create-account-btn">Criar conta</button>
            <p class="create-acc">Já possui conta?
                <a class="register-link" href="#login">Faça o seu login</a>  
            </p>
        </div>
    `;
    container.innerHTML=template

    container.querySelector("#create-account-btn").addEventListener("click", (event) =>{
        event.preventDefault();
        const email = document.getElementById("user-email").value; 
        const password = document.getElementById("user-password").value;
        const passwordConfirm = document.getElementById("user-password-confirm").value;
        if (password !== passwordConfirm) {
            alert("As senhas não são iguais!");
        }firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
            window.location.hash = "home"
        })
    })
    return container;
}


