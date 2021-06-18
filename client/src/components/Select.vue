<template>
    <div class="select select_click">
        <div class="title" @click="openOptions">
            <p>{{ title }}</p>
            <img id="arrow" class="arrow" src="../assets/users/arrow.png" alt="">
        </div>
        <transition name="select">
            <div v-if="optionsIsVisible" class="select__options">
                <p 
                    v-for="option in options"
                    :key="option.value"
                    @click="optionClick(option)"
                >
                    {{ option.name }}
                </p>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: "select",
    data() {
        return {
            optionsIsVisible: false
        }
    },
    props: {
        title: {
            type: String, 
            default() {
                return 'Выбор';
            }
        },
        options: {
            type: Array, 
            default() {
                return ['Не выбрано'];
            }
        }
    },
    methods: {
        hideSelect() {
            this.optionsIsVisible = false;
                const arrowClasses = document.getElementById('arrow').classList;
            if(arrowClasses.contains('arrow_rotate')) arrowClasses.remove('arrow_rotate');
        },
        openOptions() {
            if(this.optionsIsVisible === false)
            {
                const arrowClasses = document.getElementById('arrow').classList;
                if(!arrowClasses.contains('arrow_rotate')) arrowClasses.add('arrow_rotate');
                this.optionsIsVisible = true;
                
            }
            else
                this.hideSelect();
        },
        optionClick(option) {
            this.hideSelect();
            this.$emit('select', option);
        }
    },
    mounted() {
        const hideOptions = this.hideSelect;
        document.addEventListener('click', function(e) {
            if(!e.target.closest('.select_click')) hideOptions();
        });
    },
    beforeUnmount() {
        document.removeEventListener('click', this.hideSelect);
    }
    // methods: {
    //     optionClick(option) {
    //         this.$emit('select', option);
    //         this.hideSelect();
    //     },
    //     openSelect() {
    //         if (!this.optionsIsVisible)
    //             this.optionsIsVisible = true;
    //     },
    //     hideSelect() {
    //         this.optionsIsVisible = false;
    //     }
    // },
    // mounted() {
    //     document.addEventListener('click', this.hideSelect.bind(this), true);
    // },
    // beforeUnmount() {
    //     document.removeEventListener('click', this.hideSelect);
    // }
}
</script>

<style scoped>
.title {
    padding-left: 23px;
    height: 65px;
    background: white;
    border-radius: 7px;

    display: flex;
    align-items: center;

    cursor: pointer;
    z-index: 0;
}

.title p {
    font-size: var(--fnt-nav-2);
}

.select {
    position: relative;
    width: 350px;
}

.select p {
    font-size: var(--fnt-nav-2);
    margin: 0;
    font-weight: 400;
}

.select__options {
    box-sizing: border-box;
    position: absolute;
    padding-left: 23px;
    top: 69px;
    right: 0;
    width: 100%;

    background: white;
    border-radius: 7px;
}

.arrow {
    width: 28px;
    height: auto;
    cursor: pointer;
    transition-duration: .3s;

    margin-left: auto;
    justify-self: flex-end;
    margin-right: 23px;
}

.arrow_rotate {
    transform: rotate(-180deg);
}

.select-enter-active, .select-leave-active {
    transition: .1s ease-in;
}

.select-enter-from, .select-leave-to {
    transform: translateY(-4px);
    opacity: 0;
}

@media (max-width: 1600px) {
    .arrow {
        width: var(--fnt-nav-2);
    }
}
</style>