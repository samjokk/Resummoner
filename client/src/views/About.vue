<template>
    <div id="about_container" class="container">
        <div class="about__photos">
            <div class="timur"></div>
            <div class="artem"></div>
            <div class="elena"></div>
        </div>
        <div class="about__main">
            <div class="about_1">
                <p class="about__header">
                    Что это?
                </p>
                <p class="about__text">
                    Resummoner – проект, предназначенный для изучения социального отклика на происходящие в обществе и мире события посредством социальных сетей.
                </p>
            </div>
            <div class="about_2">
                <p class="about__header">
                    Что значит Resummoner?
                </p>
                <p class="about__text">
                    Resummoner является “суммой” двух английских слов: “response” как изучаемый нами отклик и “summoner”, определяющий наш сайт как Призывателя информации.
                </p>
            </div>
            <div class="about_3">
                <p class="about__header">
                    Кто мы?
                </p>
                <p class="about__text">
                    Мы – студенты-аналитики <span class="about__bmstu">МГТУ им. Н. Э. Баумана</span> или как будущие специалисты, лица заинтересованные. Созданный ресурс позволит объединить количественную информацию с качественным анализом в одном месте, сокращая объем ручного труда аналитика!
                </p>
            </div>
            <div class="about_4">
                <p class="about__header">
                    Нам не все равно
                </p>
                <p class="about__text">
                    В первую очередь, дорогие друзья аналитики, наше детище для вас, поэтому мы всегда открыты вашим пожеланиями и замечаниям. 
                    <span class="about__feedback">resummoner.feedback@gmail.com – отправьте нам свой отзыв!</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>

</script>

<style scoped>
#about_container {
    display: flex;
    height: auto;
}

#about_container>div {
    margin-left: 70px;
}

.about_block {
    background: white;
    border-radius: 15px;
}

.about__photos {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
}

.about__photos div {
    width: 245px;
    height: 245px;
    border-radius: 30px;
    background-position: center;
    background-size: contain;
}

.about__bmstu {
    font-size: 25px;
    color: var(--clr-standart);
}

.about__feedback {
    font-size: 25px;
    font-weight: 600;
    color: var(--clr-standart);
}

.timur {
    background-image: url(../assets/about/timur.jpg);
}

.artem {
    background-image: url(../assets/about/artem.jpg);
}

.elena {
    background-image: url(../assets/about/elena.jpg);
}


.about__main {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-right: 25px;
}

.about__header {
    font-size: 30px;
    font-weight: 600;
    color: var(--clr-standart);
    font-style: italic;
}

.about__text {
    font-size: 25px;
}

.about__main>div {
    background: #FFFFFF;
    box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.05);
    border-radius: 15px;
    width: 100%;
    padding-left: 32px;
    padding-top: 25px;
    padding-bottom: 25px;
    padding-right: 25px;
    text-align: justify;
    box-sizing: border-box;
    margin-top: 15px;
    margin-bottom: 15px;
}

@media (max-width: 1600px) {
    #about_container>div {
        margin-left: 50px;
    }

    .about__photos div {
        width: 200px;
        height: 200px;
    }
}

@media (max-width: 992px) {
    #about_container>div {
        margin-left: 0px;
    }

    .about__header {
        font-size: 17px;
    }

    .about__text {
        font-size: 15px;
    }

    span {
        font-size: 15px !important;
    }

    .about__main {
        padding-left: 25px;
    }

    .about__photos {
        display: none;
    }
}

@media (max-width: 485px) {
    .about__header {
        font-size: 13px;
    }

    .about__text {
        font-size: 11px;
    }

    span {
        font-size: 11px !important;
    }

    .about__feedback {
        display: none;
    }
}
</style>
