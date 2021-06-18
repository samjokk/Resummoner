<template>
  <div id="analysis_container" class="container">
    <MessageModal
      :message="message"
      :errorMessage="errorMessage"
      :modalClass="modalClass"
      @closed="closeMessageModal"
    />
    <Sample
      @getAnalysis="getAnalysis($event)"
      @weekError="weekError"
      @skipReset="skipReset"
    />
    <YearAnalysis
      v-if="showChart"
      v-bind:sources="sources"
      v-bind:theme="theme"
      v-bind:firstDate="Date.parse(from) / 1000"
      v-bind:lastDate="Date.parse(to) / 1000"
    />
    <Post v-for="post in posts" :key="post.id" :post="post" :theme="theme" />
    <div id="toTop" @click="filterScroll">
      <svg width="33" height="30" viewBox="0 0 33 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30.9459 2.69872H11.7584C11.2309 1.13196 9.74899 0 8.00662 0C6.26425 0 4.78232 1.13196 4.25481 2.69872H1.25979C0.564049 2.69872 0 3.26277 0 3.95851C0 4.65424 0.564049 5.21829 1.25979 5.21829H4.25489C4.78241 6.78505 6.26433 7.91701 8.0067 7.91701C9.74907 7.91701 11.231 6.78505 11.7585 5.21829H30.946C31.6417 5.21829 32.2058 4.65424 32.2058 3.95851C32.2058 3.26277 31.6417 2.69872 30.9459 2.69872V2.69872ZM8.00662 5.39744C7.21321 5.39744 6.56769 4.75192 6.56769 3.95851C6.56769 3.16509 7.21321 2.51958 8.00662 2.51958C8.80004 2.51958 9.44555 3.16509 9.44555 3.95851C9.44555 4.75192 8.80004 5.39744 8.00662 5.39744Z" fill="#34365C"/>
      <path d="M30.9459 13.4936H27.9508C27.4233 11.9269 25.9413 10.7949 24.199 10.7949C22.4567 10.7949 20.9748 11.9269 20.4473 13.4936H1.25979C0.564049 13.4936 0 14.0577 0 14.7534C0 15.4492 0.564049 16.0132 1.25979 16.0132H20.4473C20.9748 17.58 22.4568 18.7119 24.1991 18.7119C25.9414 18.7119 27.4234 17.58 27.9509 16.0132H30.946C31.6417 16.0132 32.2058 15.4492 32.2058 14.7534C32.2058 14.0577 31.6417 13.4936 30.9459 13.4936ZM24.1991 16.1924C23.4057 16.1924 22.7602 15.5468 22.7602 14.7534C22.7602 13.96 23.4057 13.3145 24.1991 13.3145C24.9925 13.3145 25.638 13.96 25.638 14.7534C25.638 15.5468 24.9925 16.1924 24.1991 16.1924Z" fill="#34365C"/>
      <path d="M30.9459 24.2886H17.156C16.6284 22.7218 15.1465 21.5898 13.4041 21.5898C11.6618 21.5898 10.1798 22.7218 9.65232 24.2886H1.25979C0.564049 24.2886 0 24.8526 0 25.5483C0 26.2441 0.564049 26.8081 1.25979 26.8081H9.65232C10.1798 28.3749 11.6618 29.5069 13.4041 29.5069C15.1465 29.5069 16.6284 28.3749 17.156 26.8081H30.946C31.6417 26.8081 32.2058 26.2441 32.2058 25.5483C32.2058 24.8526 31.6417 24.2886 30.9459 24.2886ZM13.4041 26.9874C12.6107 26.9874 11.9652 26.3418 11.9652 25.5484C11.9652 24.755 12.6107 24.1095 13.4041 24.1095C14.1976 24.1095 14.8431 24.7549 14.8431 25.5483C14.8431 26.3418 14.1976 26.9874 13.4041 26.9874V26.9874Z" fill="#34365C"/>
      </svg>
    </div>
  </div>
</template>

<script>
import Post from "../components/Post";
import Sample from "../components/Sample";
import MessageModal from "../components/MessageModal.vue";
import YearAnalysis from "../components/YearAnalysis";
import { getUser } from "../services/api";

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

const { getPosts } = require("../services/api");
const { sleep } = require("../services/actions");
export default {
  data() {
    return {
      message: "",
      errorMessage: "",
      modalClass: "closed",
      modalOpened: false,
      timeout: null,
      sessionSkip: 0,
      scrolled: 0,
      timer: null,
      showPosts: false,
      posts: [],
      theme: 1,
      sources: [],
      from: "",
      to: "",
      postTimer: "",
      showChart: false,
    };
  },
  components: {
    Post,
    Sample,
    MessageModal,
    YearAnalysis,
  },
  async beforeMount() {
    const token = localStorage.getItem('token');
    if(token) {
      const res = await getUser(token);
      if(res.status === 200) {
        //
      }
      else {
        localStorage.clear();
        window.location.reload();
      }
    }
  },
  methods: {
    filterScroll() {
      this.scrolled = window.pageYOffset;
      this.scrollToTopFilter();
    },
    openMessageModal(json) {
      this.scrolled = window.pageYOffset;
      this.scrollToTop();
      const close = this.closeMessageModal;
      this.showErrorModal = true;
      this.errorMessage = "Неверно выбраны фильтры :(";
      this.message = json.message;
      this.modalClass = "opened";
      if (this.modalOpened) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => close(), 2.3 * 1000);
      } else {
        this.modalOpened = true;
        this.timeout = setTimeout(() => close(), 2.3 * 1000);
      }
    },
    closeMessageModal() {
      this.modalClass = "closed";
      this.modalOpened = false;
      clearTimeout(this.timeout);
    },
    scrollToTop() {
      if (this.scrolled > 0) {
        window.scrollTo(0, this.scrolled);
        this.scrolled -= 30;
        this.timer = setTimeout(this.scrollToTop, 5);
      } else {
        clearTimeout(this.timer);
        window.scrollTo(0, 0);
      }
    },
    scrollToTopFilter() {
      if (this.scrolled > 0) {
        window.scrollTo(0, this.scrolled);
        this.scrolled -= 700;
        this.timer = setTimeout(this.scrollToTopFilter, 1);
      } else {
        clearTimeout(this.timer);
        window.scrollTo(0, 0);
      }
    },
    async getAnalysis(e) {
      if (e.theme === null)
        this.openMessageModal({ message: "Вы не выбрали тему" });
      else if (e.sources.length === 0)
        this.openMessageModal({ message: "Вы не выбрали источники" });
      else {
        this.showChart = false;
        let sourcesStr = "";
        for (const source of e.sources) sourcesStr += `${source}%20`;
        const res = await getPosts(
          e.theme,
          sourcesStr,
          e.from,
          e.to,
          this.sessionSkip
        );
        const json = await res.json();
        if (this.sessionSkip === 0) this.posts = [];
        this.sessionSkip += json.posts.length;
        this.theme = e.theme;
        this.sources = e.sources;
        this.from = e.from;
        this.to = e.to;

        this.showChart = true;
        await sleep(1000);
        for (const post of json.posts) this.posts.push(post);
        this.showPosts = true;
        window.addEventListener("scroll", this.onScroll);
      }
    },
    weekError() {
      this.openMessageModal({
        message: "Минимальный временной интервал: 1 неделя",
      });
    },
    clearTimer() {
      this.isRequested = false;
      clearTimeout(this.postTimer);
    },
    async addMorePosts() {
     if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 1
      ) {
        const clearTimer = this.clearTimer;
        this.postTimer = setTimeout(() => clearTimer(), 1200);
        if (this.isRequested) return;
        let sourcesStr = "";
        for (const source of this.sources) sourcesStr += `${source}%20`;
        const res = await getPosts(
          this.theme,
          sourcesStr,
          this.from,
          this.to,
          this.sessionSkip
        );
        const json = await res.json();
        this.sessionSkip += json.posts.length;
        for (const post of json.posts) this.posts.push(post);
        this.isRequested = true;
      }
    },
    async dataForLineChart(lastDate, firstDate, indexTheme) {
      let res = await getDataForLineChart(lastDate, firstDate, indexTheme);
      return await res.json();
    },
    skipReset() {
      this.sessionSkip = 0;
    },
    async onScroll() {
      window.onscroll = await this.addMorePosts();
    },
  },
};
</script>

<style scoped>
#analysis_container {
  height: 100%;
}

#toTop {
  position: fixed;
  right: 25px;
  bottom: 25px;
  width: 60px;
  height: 60px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  background: white;
  box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.1);
  border-radius: 50%;

  transition-duration: .2s;
}

#toTop svg path {
  transition-duration: .2s;
}

#toTop:hover {
  box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.05);
  right: 24.5px;
  bottom: 24.5px;
}

#toTop:hover svg path {
  fill: #3e416d;
}

@media (max-width: 992px) 
{
  #toTop {
    width: 30px;
    height: 30px;
    right: 18px;
    bottom: 18px;
  }

  #toTop svg {
    width: 15px;
    height: auto;
  }

  #toTop:hover {
    right: 17.5px;
    bottom: 17.5px;
  }
}
</style>

