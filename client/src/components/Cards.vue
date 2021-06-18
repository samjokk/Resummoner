<template>
    <div class="collection">
        <div class="collection__card card_props card_1">
            <img src="../assets/cards/card1.png" alt="card1" class="img">
            <h2>Шаг 1.</h2>
            <p>Выберите интересующие Вас темы для отображения анализа.</p>
        </div>
        <div class="collection__card card_props card_2">
            <img src="../assets/cards/card2.png" alt="card2" class="img">
            <h2>Шаг 2.</h2>
            <p>Выберите новостные источники для отображения необходимого события.</p>
        </div>
        <div class="collection__card card_props card_3">
            <img src="../assets/cards/card3.png" alt="card3" class="img">
            <h2>Шаг 3.</h2>
            <p>Нажмите кнопку “анализировать” для получения готового результата в виде графиков и диаграмм!</p>
        </div>
    </div>
</template>

<style scoped>
    .collection {
        display: flex;
        height: 581px;
        width: 100%;
        margin-top: 39px;
        align-items: center;
        justify-content: center;
        margin-bottom: 2%;
    }

    .card_1 {
        margin-left: 4%;
    }

    .card_2 {
        margin-left: 4%;
        margin-right: 4%;
    }

    .card_3 {
        margin-right: 4%;
    }

    .img {
        width: 140px;
        height: 140px;
        margin-top: 42px;
    }

    .card_props {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 426px;
        height: 576px;
        border-radius: 25px;
        background: #fff;
        cursor: default;
        box-shadow: 5px 8px 20px rgba(1, 19, 44, 0.28);
        transition-duration: 0.3s;
    }
    
    .card_props:hover {
        box-shadow: 5px 8px 5px rgba(2, 38, 61, 0.28);
        margin-top: 7px;
    }

    h2 {
        font-weight: 600;
        font-size: 30px;
        line-height: 37px;
        margin-top: 16px;
        color: var(--clr-standart);
    }

    p {
        margin-top: 50px;
        margin-left: 30px;
        max-width: 280px;
        color: var(--clr-standart);
    }

    @media (max-width: 1600px){
        .collection {
            height: 434px;
        }
        
        .card_props {
            height: 430px;
            min-width: 300px;
        }

        .card_props:hover {
            margin-top: 4px;
        }

        .card_2 {
            margin-left: 2.5%;
            margin-right: 2.5%;
        }

        .img {
            width: 100px;
            height: 100px;
        }

        h2 {
            font-size: 25px;
        }

        p {
            font-size: 23px;
            margin-top: 25px;
            max-width: 250px;
            min-width: 235px;
        }
    }

    @media (max-width: 1270px) {
        .collection {
            flex-direction: column;
            height: auto;
            width: 426px;
        }

        .card_props:hover {
            margin-top: 0;
            box-shadow: 5px 8px 20px rgba(1, 19, 44, 0.28);
        }
        
        .card_2:hover {
            margin-top: 6%;
        }

        .card_props {
            max-width: 426px;
            width: 426px;
            height: 576px;
        }

        .card_1, .card_2, .card_3 {
            margin-left: 0;
            margin-right: 0;
        }

        .card_2 {
            margin-top: 6%;
            margin-bottom: 6%;
        }

        h2 {
            font-size: 30px;
        }

        p {
            font-size: 32px;
            margin-top: 50px;
            margin-left: 30px;
            max-width: 280px;
        }
        
        .img {
            width: 140px;
            height: 140px;
            margin-top: 42px;
        }
    }

    @media (max-width: 600px) {
        .collection {
            min-width: 220px;
            max-width: 240px;
            margin-top: 20px;
        }

        .img {
            margin-top: 20px;
            width: 100px;
            height: 100px;
        }

        h2 {
            font-size: 26px
        }

        p {
            font-size: 21px;
            margin-top: 15px;
            max-width: 210px;
            min-width: 200px
        }

        .card_1 p {
            margin-top: 20px;
        }

        .card_props {
            height: 420px;
            min-width: 230px;
            max-width: 240px;
        }
    }
</style>