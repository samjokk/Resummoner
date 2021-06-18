<template>
    <div class="selection">
        <div class="selection__title">
            <p>{{ title }}</p>
        </div>
        <div class="selection__main">
            <div class="selection__field" v-for="option in options" :key="option.value">
                <label>
                    <input 
                        :type="option.inputType" 
                        :name="option.inputType === 'radio' ? 'field' : option.value"
                        @change="$emit('changeState', option.value)"
                    >
                    <span :class="`selection_button selection_${option.inputType}`"></span>
                    <p>{{ option.name }}</p>
                </label>
            </div>
        </div>
    </div>
</template>

<script>
export default {
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
                return [{
                    value: 'field1',
                    name: "Не выбрано",
                    inputType: 'radio'
                }]; // { value: String, name: String, inputType: 'radio'|'checkbox' }
            }
        }
    }
}
</script>

<style scoped>
.selection {
    display: flex;
    flex-direction: column;
}

.selection__title {
    margin-top: 25px;
    background: white;
    padding-top: 18px;
    padding-bottom: 18px;
    border-radius: 7px;
    padding-left: 15px;
    padding-right: 45px;
    box-shadow: 0px 3px 20px 2px rgba(0, 0, 0, 0.15);
}

.selection__title p {
    font-size: var(--fnt-nav-2);
}

.selection__field {
    margin-top: 20px;
}

.selection__field:first-child {
    margin-top: 0;
}

.selection__field label {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.selection__field label p {
    margin-left: 5px;
    font-size: var(--fnt-nav-2);
}

.selection__main {
    background: white;
    border-radius: 7px;
    margin-top: 5px;
    padding-left: 15px;
    padding-right: 45px;
    padding-top: 11px;
    padding-bottom: 11px;
    box-shadow: 0px 3px 20px 2px rgba(0, 0, 0, 0.15);
}

input[type="radio"],
input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    position: absolute;
}

.selection_button {
    transition: .15s;
    background-size: 25px 25px;
    width: 25px;
    height: 25px;
}

.selection_radio {
    background-image: url(../assets/posts/radio_unchecked.svg);
}

input[type="radio"]:checked + .selection_radio {
    background-image: url(../assets/posts/radio_checked.svg);
}

.selection_checkbox {
    background-image: url(../assets/posts/checkbox_unchecked.svg);
}

input[type="checkbox"]:checked + .selection_checkbox {
    background-image: url(../assets/posts/checkbox_checked.svg);
}

@media (max-width: 1770px) {
    .selection_button {
        background-size: 20px 20px;
        width: 20px;
        height: 20px;
    }

    .selection__title p {
        font-size: var(--fnt-size-3);
    }

    .selection__field label p {
        margin-left: 5px;
        font-size: var(--fnt-size-3);
    }
}

@media (max-width: 550px) {
    .selection__main {
        padding-left: 10px;
        padding-right: 5px;
    }

    .selection_button {
        background-size: 12px 12px;
        max-width: 12px;
        min-width: 12px;
        max-height: 12px;
        min-height: 12px;
    }

    .selection__title {
        padding-left: 10px;
    }

    .selection__title p {
        font-size: var(--fnt-size-5);
    }

    .selection__field label p {
        margin-left: 5px;
        font-size: var(--fnt-size-5);
    }
}

</style>