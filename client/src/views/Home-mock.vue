<template>
    <div class="main">
        <div class="info">
            <div class="info__first">
                <div class="square">10</div>
                <p class="description">Новостных источников</p>
            </div>
            <div class="info__second">
                <div class="square">6</div>
                <p class="description">Различных тем</p>
            </div>
            <div class="info__third">Призывай данные в один клик!</div>
        </div>
        <Cards class="collection__cards"/>
        <router-link class="button" to="/test">Перейти к работе</router-link>
    </div>
</template>

<script>
import Cards from '../components/Cards';
export default {
    name: 'app',
    components: {
        Cards
    }
}
</script>


<style>
    .main {
        display: flex;
        flex-direction: column;
        margin-left: 80px;
        padding-top: 10vh;
    }

    .brd {
        border: 1px solid black;
    }
    
    .info {
        width: 1379px;
        height: 100px;
        display: flex;
    } 

    .info__first {
        width: 332px;
        height: 100px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .square { 
        width: 100px;
        height: 100px;
        border-radius: 20px;
        background: #34365C;
        font-weight: 600;
        font-size: 50px;
        line-height: 61px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .description {
        font-weight: 600;
        font-size: 30px;
        line-height: 37px;
        width: 214px;
        height: 75px;
        margin-left: 18px;
        color: #34365C;
    }

    .info__second {
        width: 340px;
        height: 100px;
        margin-left: 38px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .info__third {
        width: 582px;
        height: 100px;
        font-weight: 600;
        font-size: 44px;
        line-height: 54px;
        text-align: right;
        margin-left: 87px;
        color: #34365C;
    }

    .button {
        width: 480px;
        height: 65px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        margin-top: 45px;
        border-radius: 15px;
        align-self: center;
        border: 2px solid #34365C;
        background: none;
        font-weight: 600;
        color: #34365C;
        transition-duration: 500ms;
        transition-delay: 50ms;
    }

    .button:hover { 
        background: #34365C;
        color: #fff;
    }
</style>