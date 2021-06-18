<template>
    <div id="prompt_container" :class="`${promptClass}`">
        <div class="prompt">
            <p>{{ promptText }}</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        promptClass: {
            type: String,
            default() {
                return '';
            }
        },
        promptText: {
            type: String,
            default() {
                return 'Текста нет :(';
            }
        }
    }
}
</script>

<style scoped>
#prompt_container {
    position: absolute;
    transform: translate(-30%, -20px);
    transition: .4s ease;
    transition-delay: 0.1s;
}

#prompt_container p {
    color: white;
    font-size: var(--fnt-size-4);
}

.prompt {
    background-color: var(--clr-msg-modal);
    padding: 7px 15px 7px 15px;
    display: flex;
    min-width: 110px;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
}

.invisible {
    opacity: 0;
}

.visible {
    opacity: 1;
}
</style>