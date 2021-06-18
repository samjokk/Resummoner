<template>
  <div id="charts" class="Charts">
    <div v-if="post.hasOwnProperty('morePopular')">
      <img
        v-if="post.morePopular.includes(true)"
        src="../assets/charts/morePopular.svg"
        alt="Arrow popularity"
        class="arrow"
      />
      <img
        v-else
        src="../assets/charts/lessPopular.svg"
        alt="Arrow popularity"
        class="arrow"
      />
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default {
  mounted() {
    const indexTheme = this.post.themes.indexOf(+this.theme);
    let divActivity = document.createElement("div");
    let divDissemination = document.createElement("div");
    let divStatistics = document.createElement("div");
    divActivity.className = "eachChart";
    divDissemination.className = "eachChart";
    divStatistics.className = "statisticsChart";
    let canvasActivity = document.createElement("canvas");
    let canvasDissemination = document.createElement("canvas");
    let canvasStatistics = document.createElement("canvas");
    canvasActivity.height = "500";
    canvasDissemination.height = "500";
    canvasStatistics.height = "250";
    let elem = document.getElementById("charts");
    elem.id = this.id;
    let chartActivity = canvasActivity.getContext("2d");
    let chartDissemination = canvasDissemination.getContext("2d");
    let chartStatistics = canvasStatistics.getContext("2d");
    new Chart(chartActivity, {
      type: "bar",
      data: {
        labels: [
          "Предыдущая публикация",
          "Видимая публикация",
          "Следующая публикация",
        ],
        datasets: [
          {
            label: "Активность публикации",
            data: [
              this.post.activity[indexTheme][0],
              this.post.activity[indexTheme][1],
              this.post.activity[indexTheme][2],
            ],
            backgroundColor: [
              "rgba(156, 157, 210, 1)",
              "rgba(143, 144, 172, 1)",
              "rgba(187, 185, 218, 1)",
            ],
            borderColor: [
              "rgba(156, 157, 210, 1.5)",
              "rgba(143, 144, 172, 1.5)",
              "rgba(187, 185, 218, 1.5)",
            ],
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    new Chart(chartDissemination, {
      type: "bar",
      data: {
        labels: [
          "Предыдущая публикация",
          "Видимая публикация",
          "Следующая публикация",
        ],
        datasets: [
          {
            label: "Распространяемость публикации",
            data: [
              this.post.dissemination[indexTheme][0],
              this.post.dissemination[indexTheme][1],
              this.post.dissemination[indexTheme][2],
            ],
            backgroundColor: [
              "rgba(156, 157, 210, 1)",
              "rgba(143, 144, 172, 1)",
              "rgba(187, 185, 218, 1)",
            ],
            borderColor: [
              "rgba(156, 157, 210, 1.5)",
              "rgba(143, 144, 172, 1.5)",
              "rgba(187, 185, 218, 1.5)",
            ],
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    new Chart(chartStatistics, {
      type: "bar",
      data: {
        labels: [
          "Активность публикации",
          "Интерес пользователей",
          "Рапспространение публикации",
          "Привлечение пользователя",
        ],
        datasets: [
          {
            label: "Статистика по публикации",
            data: [
              this.post.activity[indexTheme][1],
              this.post.interest[indexTheme][1],
              this.post.dissemination[indexTheme][1],
              this.post.detention[indexTheme], //ЕСЛИ ОШИБКА ТО ПОСТАВИТЬ 0
            ],
            backgroundColor: [
              "rgba(143, 144, 172, 1)",
              "rgba(143, 144, 172, 1)",
              "rgba(143, 144, 172, 1)",
              "rgba(143, 144, 172, 1)",
            ],
            borderColor: [
              "rgba(143, 144, 172, 1.5)",
              "rgba(143, 144, 172, 1.5)",
              "rgba(143, 144, 172, 1.5)",
              "rgba(143, 144, 172, 1.5)",
            ],
            borderWidth: 2,
          },
          {
            label: "Средняя статистика по выбранной теме в источнике",
            data: [
              this.post.averageValues[indexTheme][0],
              this.post.averageValues[indexTheme][1],
              this.post.averageValues[indexTheme][2],
              this.post.averageValues[indexTheme][3],
            ],
            backgroundColor: [
              "rgba(187, 185, 218, 1)",
              "rgba(187, 185, 218, 1)",
              "rgba(187, 185, 218, 1)",
              "rgba(187, 185, 218, 1)",
            ],
            borderColor: [
              "rgba(187, 185, 218, 1.5)",
              "rgba(187, 185, 218, 1.5)",
              "rgba(187, 185, 218, 1.5)",
              "rgba(187, 185, 218, 1.5)",
            ],
            borderWidth: 2,
          },
        ],
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
    divDissemination.append(canvasDissemination);
    divStatistics.append(canvasStatistics);
    elem.append(divActivity);
    elem.append(divDissemination);
    elem.append(divStatistics);
  },
  props: {
    post: Object,
    id: String,
    theme: String,
  },
};
</script>

<style>
.Charts {
  width: 75vw;
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
}

.eachChart {
  width: 17vw;
}

.statisticsChart {
  width: 34vw;
}

.arrow {
  display: block;
  margin-top: 4vh;
  height: auto;
  width: 3vw;
}

@media (max-width: 992px) {
  .Charts {
    flex-direction: column;
    justify-content: unset;
    align-items: center;
  }
}
</style>