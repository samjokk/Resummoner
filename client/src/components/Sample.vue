<template>
  <div class="sample">
    <div class="sample__datetime">
      <input
        type="datetime-local"
        @changed="$emit('skipReset')"
        onkeydown="return false"
        name="from"
        id="from"
      />
      <div class="separator"></div>
      <input
        type="datetime-local"
        @change="changedTo"
        onkeydown="return false"
        name="to"
        id="to"
      />
    </div>
    <div class="sample__main">
      <p id="info1">Выберите интересующую тему и новостные источники.</p>
      <p id="info2">
        Для Вашего удобства они поделены в зависимости от настроений!
      </p>
      <div class="sample__selections sample__graph">
        <SelectionBox
          class="sample__theme"
          :title="'Темы для анализа'"
          :options="themeOptions"
          @changeState="setTheme($event)"
        />
        <SelectionBox
          class="sample__source"
          :title="'Нейтральные'"
          :options="sourcesOptions_1"
          @changeState="changeSources($event)"
        />
        <SelectionBox
          class="sample__source"
          :title="'Либеральные'"
          :options="sourcesOptions_2"
          @changeState="changeSources($event)"
        />
        <SelectionBox
          class="sample__source"
          :title="'Консервативные'"
          :options="sourcesOptions_3"
          @changeState="changeSources($event)"
        />
      </div>
    </div>
    <div class="sample__button">
      <a @click="getAnalysisButtonClick" class="button">Перейти к анализу</a>
    </div>
  </div>
</template>

<script>
import SelectionBox from "./SelectionBox.vue";

export default {
  data() {
    return {
      themeOptions: [
        {
          value: "1",
          name: "Отравление Алексея Навального",
          inputType: "radio",
        },
        { value: "2", name: "Поправки к Конституции", inputType: "radio" },
        { value: "3", name: "Протесты в Беларуссии", inputType: "radio" },
        { value: "4", name: "Президентские выборы в США", inputType: "radio" },
        {
          value: "5",
          name: "Конфликт в Нагорном Карабахе",
          inputType: "radio",
        },
      ],
      sourcesOptions_1: [
        { value: "4", name: "Коммерсантъ", inputType: "checkbox" },
        { value: "5", name: "Известия", inputType: "checkbox" },
        { value: "6", name: "РБК", inputType: "checkbox" },
        { value: "7", name: "Ведомости", inputType: "checkbox" },
        { value: "8", name: "РИА Новости", inputType: "checkbox" },
      ],
      sourcesOptions_2: [
        { value: "1", name: "Медуза", inputType: "checkbox" },
        { value: "2", name: "Эхо Москвы", inputType: "checkbox" },
        { value: "3", name: "Лентач", inputType: "checkbox" },
      ],
      sourcesOptions_3: [
        { value: "9", name: "Вести", inputType: "checkbox" },
        { value: "10", name: "Антимайдан", inputType: "checkbox" },
      ],
      sources: [],
      theme: null,
    };
  },
  components: {
    SelectionBox,
  },
  methods: {
    changedTo() {
      this.$emit('skipReset');
      const inputTo = document.getElementById("to");
      const parsedTo = new Date(Date.parse(inputTo.value));
      const dateWeekAgo = new Date(parsedTo.setDate(parsedTo.getDate() - 6));
      const maxDateFrom = dateWeekAgo.toISOString().slice(0, -5);

      const inputFrom = document.getElementById("from");
      const parsedFrom = new Date(Date.parse(inputFrom.value));
      if (parsedFrom.getTime() > dateWeekAgo.getTime()) {
        inputFrom.value = maxDateFrom.slice(0, -3);
        this.$emit("weekError");
      }
      inputFrom.setAttribute("max", maxDateFrom);
    },
    changeSources(sourceId) {
      if (this.sources.includes(sourceId)) {
        const index = this.sources.indexOf(sourceId);
        if (index !== -1) this.sources.splice(index, 1);
      } else this.sources.push(sourceId);
      this.$emit("skipReset");
    },
    setTheme(themeId) {
      this.theme = themeId;
      this.$emit("skipReset");
    },
    getAnalysisButtonClick() {
      const inputFrom = document.getElementById("from");
      const inputTo = document.getElementById("to");
      let inputFromValue = inputFrom.value;
      let inputToValue = inputTo.value;
      if(!inputFromValue) {
        inputFrom.value = '2020-04-13T00:01';
        inputFromValue = inputFrom.value;
      }
      if(!inputToValue) {
        inputTo.value = '2021-05-29T20:59';
        inputToValue = inputTo.value;
      }
      this.$emit("getAnalysis", {
        theme: this.theme,
        sources: this.sources,
        from: inputFromValue,
        to: inputToValue,
      });
    },
  },
  mounted() {
    const inputFrom = document.getElementById("from");
    const inputTo = document.getElementById("to");
    const now = new Date(1622321940000);
    const maxDateTo = now.toISOString().slice(0, -5);
    const dateWeekAgo = new Date(now.setDate(now.getDate() - 6));
    const maxDateFrom = dateWeekAgo.toISOString().slice(0, -5);
    inputTo.setAttribute("max", maxDateTo);
    inputFrom.setAttribute("max", maxDateFrom);

    const minDateFrom = "2020-04-13T00:00";
    const minDateTo = "2020-04-19T00:00";

    inputTo.setAttribute("min", minDateTo);
    inputFrom.setAttribute("min", minDateFrom);
  },
};
</script>

<style scoped>
.sample {
  display: flex;
  flex-direction: column;

  padding-top: 24px;
  padding-left: 17px;
  padding-right: 17px;
}

.sample__datetime {
  margin-top: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sample__graph {
  background: url(../assets/posts/graph.svg) 0 100% repeat-x;
}

.sample__datetime input {
  border-radius: 7px;
  box-sizing: border-box;
  border: 2px solid white;
  background: #ffffff;
  box-shadow: 0px 3px 20px 2px rgba(0, 0, 0, 0.15);

  padding-left: 7px;
  width: 370px;
  height: 65px;
}

.sample__main {
  padding-top: 25px;
}

.sample__main p {
  line-height: 25px;
  font-size: var(--fnt-nav-2);
  text-align: center;
  color: var(--clr-standart);
}

.separator {
  height: 2px;
  width: 30px;
  margin-left: 25px;
  margin-right: 25px;
  background: rgba(0, 0, 0, 0.5);
}

.sample__main {
  display: flex;
  flex-direction: column;
}

.sample__selections {
  min-height: 500px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.sample__source {
  margin-left: 13px;
}

.sample__button {
  margin-top: 60px;
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sample__button a {
  cursor: pointer;
  padding-left: 80px;
  padding-right: 80px;
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: var(--fnt-size-1);
  color: var(--clr-standart);
  border: 2px solid var(--clr-standart);
  box-sizing: border-box;
  border-radius: 15px;
  transition: 0.25s;
}

.sample__button a:hover {
  border: 2px solid var(--clr-standart-0);
  background: var(--clr-standart);
  color: white;
}

@media (max-width: 1770px) {
  .sample__selections {
    min-height: 460px;
  }
}

@media (max-width: 1600px) {
  .sample__datetime input {
    width: 320px;
    height: 60px;
    font-size: var(--fnt-size-2);
  }

  .sample__datetime {
    margin-top: 45px;
  }

  .separator {
    width: 25px;
  }

  .sample__main p {
    margin-left: 13px;
    font-size: var(--fnt-size-3);
  }

  .sample__button a {
    padding-left: 60px;
    padding-right: 60px;
    padding-top: 8px;
    padding-bottom: 8px;
    font-size: var(--fnt-size-2);
  }
}

@media (max-width: 1440px) {
  .sample__graph {
    background: none;
  }

  .sample__button a:hover {
    border: 2px solid var(--clr-standart-0);
  }
}

@media (max-width: 1200px) {
  .separator {
    width: 20px;
  }

  .sample__datetime input {
    width: 250px;
    height: 50px;
    font-size: var(--fnt-size-3);
  }

  .sample__button a:hover {
    border: 2px solid var(--clr-standart);
    background: none;
    color: var(--clr-standart);
  }
}

@media (max-width: 992px) {
  .separator {
    width: 15px;
  }

  .sample__main p {
    font-size: var(--fnt-size-4);
  }

  .sample__datetime {
    margin-top: 20px;
  }

  .sample__datetime input {
    width: 200px;
    font-size: var(--fnt-size-5);
  }

  .sample__button a {
    padding-left: 25px;
    padding-right: 25px;
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: var(--fnt-size-4);
  }
}

@media (max-width: 850px) {
  .sample__button {
    margin-top: 35px;
  }
}

@media (max-width: 630px) {
  .separator {
    display: none;
  }

  .sample__datetime {
    flex-direction: column;
    margin-left: 13px;
  }

  #info2 {
    display: none;
  }

  .sample__datetime input {
    width: 100%;
    padding-left: 2px;
  }

  #to {
    margin-top: 10px;
  }

  .sample__datetime::before {
    content: "Временной промежуток";
    display: block;
    color: var(--clr-standart);
    font-size: 20px;
    margin-bottom: 3px;
  }

  .sample {
    padding-left: 0;
  }
}

@media (max-width: 580px) {
  .selection {
    width: 100%;
  }

  .sample__theme {
    margin-left: 13px;
  }
}
</style>
