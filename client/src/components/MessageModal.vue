<template>
    <div id="messageModal" :class="`message_modal ${modalClass}`">
        <div class="icon"><img @click="closeModal" src="../assets/modal/close-white.png" alt="Закрыть"></div>
        <div class="messages">
            <p>{{ errorMessage }}</p>
            <p>{{ message }}</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
        }
    },
    props: {
        showMessages: {
            type: Boolean,
            default() {
                return false;
            }
        },
        errorMessage: {
            type: String,
            default() {
                return 'Произошла ошибка :(';
            }
        },
        message: {
            type: String,
            default() {
                return '';
            }
        },
        modalClass: {
            type: String,
            default() {
                return '';
            }
        }
    },
    methods: {
        closeModal() {
            const elem = document.getElementsByClassName('message_modal')[0];
            const classList = elem.classList;
            if(elem && !classList.contains('closed')) {
                classList.add('closed');
                if(classList.contains('opened')) 
                    classList.remove('opened');
                this.$emit('closed');
            }
        },
        // openModal(classList) {
        // },
        // getClass() {
        //     if(this.showMessages) {
        //         return this.openModal(document.getElementById('messageModal').classList);
        //     }
        // }
    }
}
</script>


<style scoped>
    .message_modal {
        display: flex;
        flex-direction: column;
        align-items: center;
        opacity: 0;
        transition: .25s;

        width: 320px;
        height: 120px;

        position: absolute;
        right: 21px;
        top: 21px;
        margin-top: -100px;

        background: var(--clr-msg-modal);
        border-radius: 7px;
    }

    .messages {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .message_modal:hover {
        background: var(--clr-msg-modal-hover);
    }

    .messages p {
        cursor: default;
        color: white;
        font-weight: 600;
        font-size: 15px;
        box-sizing: border-box;
        margin-left: 5px;
        margin-right: 5px;
        text-align: center;
    }

    .opened {
        opacity: 1 !important;
        margin-top: 0px;
    }

    .closed {
        margin-top: -141px !important;
        opacity: 0 !important;
    }

    .icon {
        display: flex;
        width: 100%;
        justify-content: flex-end;
    }

    .icon img{
        cursor: pointer;
        width: 15px;
        height: 15px;
        margin: 15px
    }
</style>