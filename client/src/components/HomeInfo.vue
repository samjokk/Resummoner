<template>
    <div class="info">
        <div class="info__first">
            <div class="square">10</div>
            <p class="description">Новостных источников</p>
        </div>
        <div class="info__second">
            <div class="square">5</div>
            <p class="description">Тем на<br> выбор</p>
        </div>
        <div class="info__third">Призывай данные в один клик!</div>
    </div>
</template>

<style scoped>
    .info {
        width: auto;
        height: 100px;
        display: flex;
        justify-content: center;
        margin-right: 4%;
        margin-left: 4%;
        justify-self: start;
        margin-bottom: 2%;
    } 

    .info__first {
        width: 30%;
        height: 100px;
        display: flex;
        align-items: center;
    }

    .square { 
        min-width: 100px;
        min-height: 100px;
        border-radius: 20%;
        background: #34365C;
        font-weight: 600;
        font-size: 1.5em;
        line-height: 61px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .description {
        font-weight: 600;
        font-size: 1em;
        line-height: 37px;
        width: 214px;
        height: 75px;
        margin-left: 18px;
        color: #34365C;
    }

    .info__second {
        width: 30%;
        height: 100px;
        display: flex;
        align-items: center;
    }

    .info__third {
        display: flex;
        align-items: center;
        width: 40%;
        height: 100px;
        font-weight: 600;
        font-size: 1.1em;
        line-height: 54px;
        text-align: right;
        color: var(--clr-standart);
    }

    @media (max-width: 1600px) {
        .info__first, .info__second, .info__third {
            font-size: 0.85em;
        }

        .square {
            min-width: 80px;
            min-height: 80px;
            font-size: 1.3em;
        }

        .description, .info__third {
            line-height: 1.4em;
            font-size: 0.9em;
        }

        .description { 
            height: 65px;
        }
    }

    @media (max-width: 1270px) {
        .info {
            width: 426px;
            height: auto;
            flex-direction: column;
            align-items: start;
            justify-content: unset;
            margin: 0;
        }

        .info__first, .info__second, .info__third {
            width: 100%;
            font-size: 1em;
        }

        .info__first {
            margin-top: 4vh;
        }

        .info__second, .info__third {
            margin-top: 15px;
        }

        .info__third {
            text-align: unset;
        }

        .square {
            min-width: 100px;
            min-height: 100px;
            font-size: 1.5em;
        }

        .description, .info__third {
            line-height: 37px;
            font-size:  1em;
        }

        .description { 
            height: auto;
            width: 100%;
        }
    }

    @media (max-width: 600px) {
        .info {
            width: auto;
        }

        .info__first, .info__second, .info__third {
            font-size: .6em;
            line-height: 30px;
            height: auto;
            width: auto;
        }

        .info__third {
            max-width: 210px;
            min-width: 200px;
        }

        .square {
            min-width: 60px;
            min-height: 60px;
            font-size: 1.1em;
        }

        .description {
            line-height: 28px;
            max-width: 110px;
            min-width: 110px;
            height: auto;
            width: auto;
        }
    }
</style>