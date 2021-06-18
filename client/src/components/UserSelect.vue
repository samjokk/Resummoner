<template>
    <div 
        class="selectbar select indent"
        v-if="isLogin"
        @click="openOptions" 
        ref="area"
    >
        <transition name="select">
            <div 
                class="select__options" 
                v-if="optionsVisible"
            >
                <p class="select__profile" @click="profileHandler">Профиль</p>
                <p @click="logout">Выйти</p>

            </div>
        </transition>
        <div class="user">
            <img id="navimg" class="user__img" src="../assets/users/user.png" alt="User: ">
            <p> {{ username }}</p>
            <div class="select__button">
                <img
                    src="../assets/users/arrow.png" 
                    alt="^"
                    :class="arrowClasses"
                >
            </div>
        </div>
        
    </div>
    <div class="selectbar" v-else>
        <div 
            class="user indent"
            @click="$emit('userButtonClick')"
        >
            <img class="user__img" src="../assets/users/user.png" alt="User: ">
            <p> {{ username }}</p>
        </div>
    </div>
</template>

<script>
import { getUser } from '../services/api';
export default {
    data() {
        return {
            optionsVisible: false,
            arrowClasses: '',
            isLogin: false
        }
    },
    components: {
    },
    props: {
        isAuthorized: {
            type: Boolean,
            default() {
                return false;
            }
        },
        username: {
            type: String,
            default: 'Login'
        }
    },
    methods: {
        hideSelect() {
            this.optionsVisible = false;
            this.arrowClasses = '';
            const elem = document.getElementsByClassName('select')[0];
            if(elem && elem.classList.contains('select_bg_opened')) {
                elem.classList.remove('select_bg_opened');
                elem.classList.add('select_bg_closed')
            }
        },
        openOptions() {
            if(this.optionsVisible === false)
            {
                this.optionsVisible = true;
                this.arrowClasses = 'invisible';
                const select = document.getElementsByClassName('select')[0];
                if(select && !select.classList.contains('select_bg_opened')) {
                    select.classList.add('select_bg_opened');
                    select.classList.remove('select_bg_closed')
                }
            }
            else 
            {
                this.hideSelect();
            }
        },
        userButtonClick() {
            if(!localStorage.getItem('token') && !localStorage.getItem('userId'))
                this.showAuthModal = true;
            else {
                this.logout();
            }
        },
        logout() {
            this.optionsVisible = false;
            this.isLogin = false;
            this.$emit('logout');
        },
        profileHandler() {
            this.optionsVisible = false;
            this.$router.push('/profile');
        }
    },
    async beforeMount() {
        this.isLogin = this.isAuthorized;
        if(localStorage.getItem('token')) {
            const res = await getUser(localStorage.getItem('token'));
            if(res.status === 200) {
                const navimg = document.getElementById('navimg');
                const json = await res.json();
                const jsonimg = json.image;
                if(jsonimg && navimg) navimg.src = jsonimg;
            }
        }
        
    },
    mounted() {
        if(this.isAuthorized && this.isLogin) {
            const hideOptions = this.hideSelect;
            document.addEventListener('click', function(e) {
                if(!e.target.closest('.indent')) hideOptions();
            });
        }
    },
    beforeUnmount() {
        document.removeEventListener('click', this.hideSelect);
    }
}
</script>

<style scoped>
.select_bg_opened {
    background: #ffffff;
    box-shadow: 0 0 15px rgba(1, 19, 44, 0.3);
}

.select_bg_closed {
    background: none;
}

.indent {
    margin-bottom: 39px;
    margin-top: auto;
    margin-left: 25px;
}

.selectbar {
    margin-top: auto;
    justify-self: flex-end;
    padding-bottom: 10px;
}

.select {
    transition: background .3s, box-shadow .2s ease-out;
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
    width: auto;
    margin-right: 25px;
    border-radius: 12px;
}

.select__button {
    padding-top: 8px;
    padding-left: 10px;
}

.select__button img {
    width: 28px;
    height: auto;
    cursor: pointer;
    transition-duration: .4s;
}

.select__options {
    font-size: var(--fnt-nav-1);
}

.select__options p {
    text-align: center;
    padding: 10px 0 10px 0;
    width: 100%;
}

.select__options p:hover {
    background: #e9e9e9;
}

.select__options:first-child {
    margin-bottom: 12px;
}

.select__profile {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
}

.invisible {
    transform: rotate(-180deg);
    opacity: 0;
}

.user {
    cursor: pointer;
    display: flex;
    align-items: center;
}

.user:hover .user__img {
    border-radius: 38%;
}

.user__img{
    width: 76px;
    height: 76px;
    border-radius: 50%;
    transition-duration: .4s;
    user-select: none;
    margin-left: 12px;
}

.user p {
    margin-left: 14px;
    width: auto;
}

.select-enter-active, .select-leave-active {
    transition: .3s;
}

.select-enter-from, .select-leave-to {
    opacity: 0;
}

@media (max-width: 1600px) {
    .user p, .select__options p{
        font-size: var(--fnt-nav-2);
    }

    .user__img {
        width: 70px;
        height: 70px;
        margin-left: 18px;
    }

    .select {
        margin-right: 19px;
    }

    .indent {
        margin-left: 19px;
    }

    .select__button img {
        width: var(--fnt-nav-2);
    }
}

@media (max-width: 1270px) {
    .select__button {
        display: none;
    }
}

@media (max-width: 1200px) {
    .user p, .select__options p {
        font-size: var(--fnt-nav-3);
    }

    .user__img {
        width: 55px;
        height: 55px;
        margin-left: 7px;
    }

    .select {
        margin-right: var(--fnt-nav-2);
    }

    .indent {
        margin-left: 30px;
    }
}

@media (max-width: 992px) {
    .select {
        flex-direction:column-reverse;
        border-radius: 10px;
    }

    .select__options:first-child {
        margin-top: 8px;
        margin-bottom: 0px;
    }

    .select__profile {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }

    .select__options p {
        font-size: 12px;
    }

    .user img {
        margin-right: 7px;
    }

    .user p {
        display: none;
    }

    .select {
        margin-left: 0;
        align-self: center;
        margin-right: 0;
    }

    .indent {
        margin-left: 0;
        justify-content: center;
    }

    .selectbar {
        justify-self: flex-start;
        margin-top: 19px;
        padding-bottom: 0px;
        padding-top: 10px;
    }
}

@media (max-height: 475px) {
    .select {
        margin-bottom: 10px;
        margin-top: 2px;
    }
}
</style>