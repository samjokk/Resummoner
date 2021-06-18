<template>
    <div id="profile_container" class="container">
        <MessageModal 
            :errorMessage="errorMessage"
            :message="message"
            :modalClass="modalClass"
            @closed="closeMessageModal"
        />
        <div class="profile__settings">
            <p>Настройки</p>
            <div class="settings_container">
                <div class="fields">
                    <div class="field">
                        <p>Фамилия</p>
                        <input @input="save" v-model="firstName" class="inp" type="text">
                    </div>
                    <div class="field">
                        <p>Имя</p>
                        <input @input="save" v-model="lastName" class="inp" type="text">
                    </div>
                    <div class="field">
                        <p>Почта</p>
                        <input @input="save" v-model="email" class="inp" type="email">
                    </div>
                    <div class="field">
                        <p>Новый пароль:</p>
                        <input @input="save" v-model="password" class="inp" type="password">
                    </div>
                </div>
                <div class="photo">
                    <div class="userlogo">
                        <label for="file">
                            <img id="userimg" class="cpointer" src="../assets/users/user.png" alt="">
                        </label>
                    </div>
                    <div class="download">
                        <input @click="fileInputClicked" type="file" name="file" id="file" class="inputfile" />
                        <label for="file" class="cpointer">Загрузить новое фото</label>
                    </div>
                    <div class="approve">
                        <Prompt 
                            class="prompt_visibility"
                            :promptClass="promptClass"
                            :promptText="'Сохранить'"
                        />
                        <!-- <img @click="saveChanges" id="approvebtn" class="cpointer" src="../assets/users/checked.svg" alt="Сохранить"> -->
                        <svg @mouseleave="hidePrompt" @mouseover="showPrompt" @click="saveChanges" id="approvebtn" class="standartsvg" width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M53.4269 7.51898C52.6178 6.70849 51.305 6.70709 50.4959 7.51555L25.6285 32.3173L16.6564 22.5728C15.8811 21.7312 14.5704 21.6767 13.7274 22.4518C12.8851 23.2271 12.8312 24.5385 13.6065 25.3808L24.0399 36.7117C24.422 37.127 24.9568 37.3682 25.5206 37.3799C25.5358 37.3805 25.5504 37.3805 25.5649 37.3805C26.1129 37.3805 26.64 37.1629 27.0283 36.776L53.4228 10.4506C54.234 9.64229 54.2354 8.32948 53.4269 7.51898Z"/>
                        <path d="M52.9271 25.4271C51.7822 25.4271 50.8543 26.355 50.8543 27.5C50.8543 40.3781 40.3781 50.8543 27.5 50.8543C14.6227 50.8543 4.14573 40.3781 4.14573 27.5C4.14573 14.6227 14.6227 4.14573 27.5 4.14573C28.6449 4.14573 29.5729 3.21782 29.5729 2.07292C29.5729 0.92791 28.6449 0 27.5 0C12.3363 0 0 12.3363 0 27.5C0 42.663 12.3363 55 27.5 55C42.663 55 55 42.663 55 27.5C55 26.3551 54.0721 25.4271 52.9271 25.4271Z"/>
                        </svg>
                    </div>
                </div>
                <!-- <div class="save_settings">
                    <p></p>
                    <div class="button_block">
                        <button class="cpointer btn button">Сохранить настройки</button>
                    </div>
                </div> -->
            </div>
        </div>
        <div class="profile__favorites">
            <p>Избранное</p>
            <div class="favorites_container">
                <p>Избранных постов ещё нет :(</p>
            </div>
        </div>
    </div>
</template>

<script>
import Prompt from '../components/Prompt';
import MessageModal from '../components/MessageModal';
const { sleep } = require('../services/actions');
const { getUser, updateUser, updateImage } = require('../services/api');

export default {
    data() {
        return {
            promptClass: 'invisible',
            errorMessage: '',
            message: '',
            modalClass: 'closed',
            modalOpened: false,
            timeout: null,
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            fileLoaderActivity: false
        }
    },
    components: {
        Prompt,
        MessageModal
    },
    methods: {
        closeMessageModal() {
            this.modalClass = 'closed';
            this.modalOpened = false;
            this.errorMessage = '';
            clearTimeout(this.timeout);
        },
        save() {
            const elem = document.getElementById('approvebtn');
            elem.classList.add('clickable');
        },
        async saveChanges() {
            const elem = document.getElementById('approvebtn');
            if(!elem.classList.contains('clickable')) return;
            elem.classList.remove('clickable');

            this.promptClass = 'invisible';
            const user = {
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email
            };
            if(this.password) user.password = this.password;
            const res = await updateUser(JSON.stringify(user));
            const json = await res.json();
            await this.openMessageModal(res.status, json.message);
        },
        async openMessageModal(statusCode, message) {
            const close = this.closeMessageModal;
            this.message = message;
            this.modalClass = 'opened';
            if(statusCode === 200) { 
                await sleep(1500);
                window.location.reload();
            }

            if(this.modalOpened) {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => close(), 2.3*1000);
            }
            else {
                this.modalOpened = true;
                this.timeout = setTimeout(() => close(), 2.3*1000);
            }
        },
        showPrompt() {
            this.promptClass = 'visible';
        },
        hidePrompt() {
            this.promptClass = 'invisible';
        },
        fileInputClicked() {
            if(this.fileLoaderActivity) return;
            this.fileLoaderActivity = true;
            
            const fileInput = document.getElementById('file');
            const img = document.getElementById('userimg');

            fileInput.addEventListener('change', () => { 
                const file = fileInput.files[0]
                const filename = file.name;
                if(!(
                    filename.includes('.jpg') ||
                    filename.includes('.png') ||
                    filename.includes('.svg') ||
                    filename.includes('.jpeg')
                )) {
                    this.errorMessage = 'Неверное расширение файла!';
                    this.openMessageModal(400, 'Допустимы форматы: .jpg, .png, .svg');
                    return;
                }
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = async () => {
                    const image = reader.result;
                    img.src = image;
                    const body = JSON.stringify({ "image": image });
                    const res = await updateImage(body);
                    const json = await res.json();
                    await this.openMessageModal(res.status, json.message);
                }
                reader.onerror = () => {
                    console.log(reader.error);
                }
            });
        }
    },
    async beforeMount() {
        const res = await getUser(localStorage.getItem('token'))
        if(res.status === 200) {
            const img = document.getElementById('userimg');
            const json = await res.json();
            this.firstName = json.firstName;
            this.lastName = json.lastName;
            this.email = json.email;
            const jsonimg = json.image;
            if(jsonimg) img.src = jsonimg;
        }
        else {
            localStorage.clear();
            window.location.reload();
        }
    }
}
</script>

<style scoped>
#userimg:hover {
    border-radius: 38%;
}

.clickable path {
    transition: 0.2s;
    fill: #9cb8ff !important;
}

.standartsvg path {
    fill: #A0A0A0;
}

.standartsvg {
    transition: .2s;
}

.clickable {
    cursor: pointer;
    transform: scale(1.12);
}

.clickable:hover path{
    fill: #8cabfa !important;
}

#profile_container {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding-right: 50px;
    padding-left: 50px;
}

.profile__settings {
    display: flex;
    flex-direction: column;
    margin-top: 64px;
}


.profile__favorites {
    display: flex;
    flex-direction: column;
    margin-top: 35px;
}

.profile__favorites p,
.profile__settings p,
.profile__settings label {
    font-size: var(--fnt-prfl-1);
    color: var(--clr-standart);
}

.settings_container, 
.favorites_container {
    margin-top: 13px;
    background: white;
    border-radius: 20px;
    width: 100%;
}

.settings_container {
    height: 398px;
    display: flex;
}

.favorites_container {
    min-height: 150px;
    max-height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.favorites_container p {
    color: var(--clr-standart);
}

.fields {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
    width: 45%;
    max-width: 570px;
    padding-left: 30px;
}

.favorites_container {
    height: 50px;      /*ПОМЕНЯЯЯЯЯЯЯЯЯЯЯЯЯЯЯТЬ!!!!!!!!!!!!*/    /*ПОМЕНЯЯЯЯЯЯЯЯЯЯЯЯЯЯЯТЬ!!!!!!!!!!!!*/
}

.settings_container p,
.settings_container label {
    width: 178px;
    font-size: var(--fnt-standart);
}

.field {
    display: flex;
    align-items: center;
}

.save_settings {
    display: flex;
    align-items: center;
}

.button_block {
    display: flex;
    justify-content: center;
    width: 320px;
}

.btn {
  border: 2px solid var(--clr-standart);
  background: white;
  transition-duration: .35s;
  font-size: var(--fnt-size-3);
  color: var(--clr-standart);
  padding: 8px;
  border-radius: 5px;
  margin-left: 9px;
}

.btn:hover {
  background: var(--clr-standart);
  color: white;
}

.link {
    font-size: var(--fnt-standart);
}

.photo {
    width: 55%;
    display: flex;
}

.userlogo {
    display: flex;
    align-items: center;
    height: 100%;
}

.userlogo img {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    transition-duration: .3s;
}

.download {
    height: 100%;
    display: flex;
    align-items: center;
}

.download label {
    margin-left: 40px;
    width: 300px !important;
    transition-duration: .3s;
    font-size: var(--fnt-size-2) !important;
}

.download label:hover {
    transform: scale(1.1);
}

.approve {
    height: 100%;
    margin-left: auto;
    padding-right: 27px;
    justify-self: flex-end;
}

.approve svg {
    width: 67px;
    height: 67px;
    margin-top: 27px;
}

@media (max-width: 1660px) {
    .approve svg {
        width: 55px;
        height: 55px;
        margin-top: 27px;
    }

    .userlogo img {
        width: 160px;
        height: 160px;
    }

    .download label {
        margin-left: 35px;
        width: 210px !important;
        transition-duration: .3s;
        font-size: var(--fnt-size-3) !important;
    }

    .profile__favorites p,
    .profile__settings p {
        font-size: var(--fnt-prfl-2);
    }

    .inp {
        font-size: var(--fnt-size-3);
    }

    .settings_container {
        height: 310px;
    }

    .fields {
        padding-left: 20px;
    }

    .settings_container p {
        width: 128px;
        font-size: var(--fnt-size-3);
    }

    .link {
        font-size: var(--fnt-size-3);
    }

    .photo {
        margin-left: auto;
        justify-self: flex-end;
        justify-content: flex-end;
    }

    .approve {
        margin-left: auto;
        justify-self:auto;
    }
}

@media (max-width: 1500px) {
    .userlogo {
        margin-left: 25px;
    }
}

@media (max-width: 1450px) {
    .settings_container {
        flex-direction: column;
        height: 500px;
    }

    .fields {
        width: 100%;
    }

    .photo {
        width: 100%;
        justify-self: flex-start;
    }

    .approve {
        height: 100%;
        padding-right: 27px;
        display: flex;
        align-items: center;
        margin-right: 30px;
    }

    .approve svg {
        width: 50px;
        height: 50px;
        margin-top: 0px;
    }
}

@media (max-width: 992px) {
    #userimg:hover {
        border-radius: 50%;
    }

    .prompt_visibility {
        display: none;
    }

    .settings_container {
        height: 430px;
    }

    #profile_container {
        padding-right: 20px;
        padding-left: 20px;
    }

    .profile__favorites p,
    .profile__settings p,
    .profile__settings label {
        font-size: var(--fnt-prfl-3);
    }

    .settings_container p,
    .settings_container label {
        width: 85px;
        font-size: var(--fnt-size-5);
    }

    .userlogo img {
        width: 100px;
        height: 100px;
    }

    .settings_container {
        flex-direction: column;
    }

    .link {
        font-size: var(--fnt-size-5);
    }
    
    input {
        width: 270px !important;
        height: 40px !important;
        border-radius: 7px;
        padding-left: 4.5%;
        margin-top: 5px;
    }

    .download label {
        margin-left: 30px;
        width: 150px !important;
        transition-duration: .3s;
        font-size: var(--fnt-size-5) !important;
    }

    .field {
        display: flex;
        flex-direction: column;
        align-items: unset;
    }

    .field p {
        width: 100%;
    }

    .fields:first-child>p {
        margin-top: 10px;
    }

    .photo {
        margin-bottom: 5px;
    }
}

@media (max-width: 570px) {
    .settings_container {
        height: 550px;
    }
    

    .photo {
        margin-top: 10px;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .fields {
        margin-left: 0;
        padding-left: 0;
        align-items: center;
    }
    

    .userlogo, .download, .approve {
        align-self: unset;
        justify-self: unset;
        margin-right: 0;
        margin-left: 0;
        padding-right: 0;
    }

    .approve {
        margin-top: 20px;
        margin-bottom: 10px;
    }

    .download label {
        text-align: center;
        margin-left: 0px;
        margin-top: 10px;
        width: 200px !important;
        transition-duration: .3s;
        font-size: var(--fnt-size-5) !important;
    }
}

@media (max-width: 500px) {
    input {
        width: 190px !important;
    }
}

.inputfile {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
}
</style>