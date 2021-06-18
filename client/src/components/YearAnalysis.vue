<template>
  <div id="charts" class="analysis_container"></div>
</template>

<script>
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
const { daysTime } = require("../services/config");
const { weaksTime } = require("../services/config");
const { monthsTime } = require("../services/config");
const border = 3;
const months = [
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
];
const sources = [
  "Медуза",
  "Эхо Москвы",
  "Лентач",
  "КоммерсантЪ",
  "Известия",
  "РБК",
  "Ведомости",
  "РИА Новости",
  "Вести",
  "Антимайдан",
];
// const colors = [
//   "#A7ACF4",
//   "#CFBFFF",
//   "#97D2EC",
//   "#9E86FF",
//   "#C6C8EB",
//   "#C5B8E8",
//   "#A1A3D3",
//   "#A3B9FF",
//   "#7B80D2",
//   "#66A9E6",
// ];
const colors = [
  "#A7ACF4",
  "#CFBFFF",
  "#97D2EC",
  "#9E86FF",
  "#C6C8EB",
  "#C5B8E8",
  "#A1A3D3",
  "#A3B9FF",
  "#7B80D2",
  "#66A9E6",
];
const { uri } = require("../env");
async function getDataForLineChart(firstDate, lastDate, indexTheme) {
  const res = await fetch(
    `${uri}api/posts/linechart?firstDate=${firstDate}&lastDate=${lastDate}&indexTheme=${indexTheme}`,
    {
      method: "GET",
    }
  );
  return res;
}

export default {
  data() {
    return {
      arrayValues: [], //Массив массивов в object.data
      arrayUnitsOfTime: [], //Массив дат в Chart.labels
    };
  },
  async mounted() {
    let getGraph = true;
    let datasets = new Array();
    if (getGraph) {
      getGraph = await this.getDataForChart();
      for (let i = 0; i < this.sources.length; i++) {
        let object = new Object();
        object.label = sources[this.sources[i] - 1];
        object.data = this.arrayValues[this.sources[i] - 1];
        object.backgroundColor = colors[this.sources[i] - 1];
        object.borderColor = colors[this.sources[i] - 1];
        object.border = border;
        datasets.push(object);
      }
    }
    let divActivity = document.createElement("div");
    divActivity.className = "chart";
    let canvasActivity = document.createElement("canvas");
    canvasActivity.height = "400";
    canvasActivity.width = "1200";
    let elem = document.getElementById("charts");
    elem.id = this.id;
    let chartActivity = canvasActivity.getContext("2d");
    new Chart(chartActivity, {
      type: "line",
      data: {
        labels: this.arrayUnitsOfTime,
        datasets: datasets,
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    divActivity.append(canvasActivity);
    elem.append(divActivity);
  },
  props: {
    sources: Array,
    theme: String,
    firstDate: Number,
    lastDate: Number,
  },
  methods: {
    async dataForLineChart(lastDate, firstDate, indexTheme) {
      let res = await getDataForLineChart(lastDate, firstDate, indexTheme);
      return await res.json();
    },
    async getDataForChart() {
      const values = await this.dataForLineChart(
        this.firstDate,
        this.lastDate,
        +this.theme
      );
      if (values.length === 420) {
        let valuesByDate = new Array();
        for (let i = 0; i < 10; i++) valuesByDate.push(new Array());
        let indexStart = 1;
        while (this.firstDate > daysTime[indexStart]) indexStart++;
        indexStart--;
        let indexEnd = 7;
        while (this.lastDate > daysTime[indexEnd - 1]) indexEnd++;
        indexEnd--;
        let firstIndex = indexStart;
        while (firstIndex <= indexEnd) {
          for (let i = 0; i < 10; i++)
            valuesByDate[i].push(values[firstIndex][i]);
          firstIndex++;
        }
        let multiplier = 1;
        if (valuesByDate[0].length > 15) {
          multiplier = 2;
          const lengthValues = valuesByDate[0].length;
          for (let i = 0; i < 10; i++)
            for (let j = 1; j < lengthValues; j += multiplier)
              valuesByDate[i].splice(lengthValues - j, 1);
        }
        for (let i = 0; i < 10; i++) this.arrayValues.push(valuesByDate[i]);
        for (let i = 0; i < valuesByDate[0].length; i++) {
          this.arrayUnitsOfTime.push(this.getDate(daysTime[indexStart]));
          indexStart += multiplier;
        }
      } else if (values.length === 60) {
        let valuesByDate = new Array();
        for (let i = 0; i < 10; i++) valuesByDate.push(new Array());
        let indexStart = 1;
        while (this.firstDate > weaksTime[indexStart]) indexStart++;
        indexStart--;
        let indexEnd = 4;
        while (this.lastDate > weaksTime[indexEnd]) indexEnd++;
        indexEnd -= 1;
        let firstIndex = indexStart - 1;
        while (firstIndex <= indexEnd) {
          for (let i = 0; i < 10; i++)
            valuesByDate[i].push(values[firstIndex][i]);
          firstIndex++;
        }
        let multiplier = 1;
        let addedArray = new Array();
        for (let i = 0; i < 10; i++)
          addedArray.push(valuesByDate[i][valuesByDate[i].length - 1]);
        if (valuesByDate[0].length > 13) {
          multiplier = 2;
          const lengthValues = valuesByDate[0].length;
          for (let i = 0; i < 10; i++)
            for (let j = 1; j < lengthValues; j += multiplier)
              valuesByDate[i].splice(lengthValues - j, 1);
        }
        for (let i = 0; i < 10; i++) this.arrayValues.push(valuesByDate[i]);
        for (let i = 0; i < valuesByDate[0].length; i++) {
          this.arrayUnitsOfTime.push(this.getDate(weaksTime[indexStart]));
          indexStart += multiplier;
        }
      } else if (values.length === 14) {
        let valuesByDate = new Array();
        for (let i = 0; i < 10; i++) valuesByDate.push(new Array());
        let indexStart = 1;
        while (this.firstDate > monthsTime[indexStart]) indexStart++;
        indexStart--;
        let indexEnd = 6;
        while (this.lastDate > monthsTime[indexEnd]) indexEnd++;
        indexEnd--;
        let firstIndex = indexStart;
        while (firstIndex <= indexEnd) {
          for (let i = 0; i < 10; i++)
            valuesByDate[i].push(values[firstIndex][i]);
          firstIndex++;
        }
        for (let i = 0; i < 10; i++) this.arrayValues.push(valuesByDate[i]);
        indexStart;
        for (let i = 0; i < valuesByDate[0].length; i++)
          this.arrayUnitsOfTime.push(months[indexStart + i]);
      }
      return false;
    },
    getDate(unxiDate) {
      const date = new Date(unxiDate * 1000);
      const day = date.getDate();
      const monthNum = (date.getMonth() + 1).toString();
      let month = monthNum;
      if (monthNum < 10) month = `0${monthNum}`;
      return `${day}.${month}`;
    },
  },
};
</script>

<style>
.analysis_container {
  width: 75vw;
  margin-top: 30px;
  margin-left: 1vw;
  display: flex;
  justify-content: center;
  background-color: rgb(255, 255, 255);
  border-radius: 15px;
}

.chart {
  width: 70vw;
}
</style>