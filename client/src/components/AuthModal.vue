<template>
  <div class="modal" ref="modal">
    <div class="modal__background">
      <a @click="closeModal" class="modal__area"></a>
      <div class="modal__window">
        <MessageModal 
          :message="message"
          :errorMessage="errorMessage"
          :modalClass="modalClass"
          @closed="closeMessageModal"
        />
        <div class="modal__header">
          <span>Авторизация</span>
          <a @click="closeModal"><img src="../assets/modal/close.png" alt="Закрыть"></a>
        </div>
        <div class="modal__appeal">
          <p>Это займет всего пару секунд!</p>
        </div>
        <div class="modal__body">
            <div class="modal__info">
              <span>Вы сможете:</span>
              <div class="favorites">
                <img src="../assets/modal/favorites.png" alt="">
                <p>Сохранять выбранные посты в избранное, при необходимости возвращаться к ним и управлять понравив- шимися постами из личного кабинета!</p>
              </div>
            </div>
            <div id="login_container">
              <form @submit.prevent="handleSubmit">
                <span>По почте и паролю:</span>
                <input type="email" v-model.trim="email" placeholder="Почта" required>
                <input class="password" type="password" v-model="password" placeholder="Пароль" required>
                <div class="actions">
                  <a class="cpointer register_link" @click="$emit('register')">Зарегистрироваться</a>
                  <button class="cpointer btn button buttonwave">Войти</button>
                </div>
              </form>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const { uri } = require('../env');
const { startAnims } = require('../services/animations');
import MessageModal from './MessageModal';

export default {
  data() {
    return {
        email: '',
        password: '',
        message: '',
        errorMessage: '',
        modalClass: 'closed',
        modalOpened: false,
        timeout: null,
        animated: false
    }
  },
  components: {
    MessageModal
  },
  methods: {
    closeModal() {
      const modal = document.getElementsByClassName('modal')[0];
      if(!modal.classList.contains('visible')) { 
        modal.classList.add('visible');
        this.$emit('closed');
      }
    },
    success() {
        const modal = document.getElementsByClassName('modal')[0];
        modal.classList.add('visible');
        this.$emit('success');
    },
    openMessageModal(json) {
      const close = this.closeMessageModal;
      this.showErrorModal = true;
      this.errorMessage = "Неверно введены данные :(";
      this.message = json.message;
      this.modalClass = 'opened';
      if(this.modalOpened) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => close(), 2.3*1000);
      }
      else {
        this.modalOpened = true;
        this.timeout = setTimeout(() => close(), 2.3*1000);
      }
    },
    closeMessageModal() {
      this.modalClass = 'closed';
      this.modalOpened = false;
      clearTimeout(this.timeout);
    },
    async handleSubmit() {
        const data = JSON.stringify({
          email: this.email,
          password: this.password
        });

        const res = await fetch(`${uri}api/users/auth`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: data
        });
        
        const json = await res.json();
        if(res.status === 200) {
          localStorage.setItem('token', json.token);
          localStorage.setItem('userId', json.userId);
          this.success();
        }
        else {
          this.openMessageModal(json);
        }
    }
  },
  mounted() {
    if(!this.animated) { 
      startAnims(); 
      this.animated = true 
    }
  }
}
</script>

<style scoped>
.modal {
  opacity: 1;
  transition-duration: .2s;
  z-index: 2;
}

.modal__area {
  position: absolute;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
}

.modal__body {
  display: flex;
  justify-content: space-between;
  height: 80%;
  padding-left: 19.5px;
  padding-right: 19.5px;
  margin-top: 15px;
}

.modal__body .modal__info, .modal__body #login_container {
  border: 2px solid var(--clr-standart);
  width: 400px;
  height: 100%;
  border-radius: 15px;
}

.modal__info {
  display: flex;
  flex-direction: column;
}

#login_container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.actions {
  margin-top: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5px;
  padding-right: 5px;
}

#login_container span {
  font-size: var(--fnt-size-5);
  margin-bottom: 1px;
}

.modal__info span {
  font-size: var(--fnt-size-1);
  font-weight: 500;

  margin-top: 33%;
  color: var(--clr-standart);
  width: 73%;
  margin-left: 30px;
}

.favorites {
  display: flex;
  margin-left: 30px;
  margin-top: 23px;
  width: 73%;
}

.favorites p {
  margin-left: 9px;
  font-size: var(--fnt-size-3);
  line-height: var(--ln-hght-mini);
  text-align: justify;
  letter-spacing: 0.06em;
  width: 237px;
  height: 157px;
}

.favorites img {
  width: 30px;
  height: 30px;
}

.visible {
  opacity: 0 !important;
  visibility: hidden;
}

.modal__background {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal__window {
  height: 585px;
  width: 855px;
  border-radius: 25px;
  background: var(--clr-windows);
  display: flex;
  flex-direction: column;
  padding: 30px;
  z-index: 2;
  margin: 10px;
}

.modal__header {
  display: flex;
  justify-content: center;
  color: var(--clr-standart);
}

.modal__header span { 
  margin-left: auto;
}

.modal__header a {
  display: flex;
  justify-self: flex-end;
  cursor: pointer;
  margin-left: auto;
  width: 15px;
  height: 15px;
}

.modal__header a img {
  transition-duration: .2s;
  width: 15px;
  height: 15px;
}

.modal__header a img:hover {
  transform: scale(1.2);
}

.modal__appeal { 
  display: flex;
  justify-content: center;
}

.modal__appeal p {
  font-size: var(--fnt-size-3);
}

form input {
  min-width: 100px;
  width: 320px;
  height: 50px;
  padding-left: 7%;
  border-radius: 10px;
  box-sizing: border-box;
  font-size: var(--ln-hght-mini);
  border: 1px solid var(--clr-brd);
}

form input::placeholder {
  color: var(--clr-placeholder);
  transition: .2s;
}

form input:focus {
  border-color: var(--clr-brd-fcs);
}

form input:focus::placeholder {
  opacity: 0;
}

.btn {
  border: 1px solid var(--clr-standart);
  background: white;
  transition-duration: .35s;
  font-size: var(--fnt-size-3);
  color: var(--clr-standart);
  padding: 10px;
  border-radius: 6px;
  margin-left: 9px;
}

.btn:hover {
  border: 1px solid white;
  background: var(--clr-standart);
  color: white;
}

.brd {
    border: 1px solid black;
}

.error_message {
    font-size: 20px;
}

.register_link {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition-duration: 1s;
  font-size: var(--fnt-size-3);
  color: var(--clr-standart);
}

.register_link::after {
  transition: 0.25s ease-in-out;
  content: '';
  width: 34%;
  height: 1px;
  display: block;
  background-color: var(--clr-standart);
  opacity: 0;
}

.register_link:hover::after {
  transform: scaleX(3);
  opacity: 1;
}

form {
  width: 320px;
}

.password {
  margin-top: 10px;
}

@media (max-width: 992px) {
  .modal__window {
    height: 550px;
    max-width: 400px;
    min-width: 250px;
  }

  .btn {
    padding: 7px;
    font-size: var(--fnt-size-4);
  }

  .modal__info {
    display:none;
  }

  .modal__header span {
    font-size: var(--fnt-size-2);
  }

  .modal__appeal p {
    font-size: var(--fnt-size-4);
  }

  .register_link {
    font-size: var(--fnt-size-4);
  }
  
  .register_link:hover::after {
    opacity: 0;
  }

  form input {
    width: 260px;
    height: 45px;
    border-radius: 7px;
    padding-left: 4.5%;
  }

  form {
    width: 260px;
  }
}

@media (max-width: 450px) {
  .modal__body {
    padding-left: 0px;
    padding-right: 0px;
  }
}
</style>