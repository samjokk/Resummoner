<template>
    <div id="home_container" class="container">
        <header>
            <HomeInfo />
        </header>
        <Cards />
        <router-link class="button" to="/analysis">Перейти к работе</router-link>
    </div>
</template>

<script>
import Cards from '../components/Cards';
import HomeInfo from '../components/HomeInfo';

const { uri } = require('../env');

export default {
    name: 'app',
    components: {
        Cards,
        HomeInfo
    },
    async beforeMount() {
        const token = localStorage.getItem('token');
        if(token) {
            const res = await fetch(`${uri}api/users/`, {
                method: 'GET',
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });

            if(res.status === 205) {
                localStorage.clear();
            }
        }
        
    }
}
</script>

<style scoped>
    #home_container {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    #home_container main {
        display: flex;
        flex-direction: column;
    }

    .button {
        width: 480px;
        height: 65px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 39px;
        align-self: center;
        text-decoration: none;
        border-radius: 15px;
        border: 2px solid var(--clr-standart);
        background: none;
        font-weight: 600;
        color: var(--clr-standart);
        transition-duration: 500ms;
        transition-delay: 50ms;
    }

    .button:hover { 
        background: var(--clr-standart);
        color: #fff;
    }

    @media (max-width: 1600px) {
        .button {
            width: 385px;
            height: 50px;
            font-size: 26px;
            border-radius: 13px;
        }
    }

    @media (max-width: 1270px) {
        #home_container {
            justify-content: unset;
            align-items: center;
        }

        .button {
            margin-bottom: 3vh;
            font-size: 27px;
            height: 60px;
        }
    }

    @media (max-width: 600px) {
        .button {
            margin-top: 2vh;
            height: 40px;
            width: 200px;
            font-size: 18px;
        }
    }
</style>