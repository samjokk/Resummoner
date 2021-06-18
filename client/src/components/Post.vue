<template>
  <div class="post_container">
    <div class="post">
      <div class="post__title">
        <a
          target="_blank"
          :href="`https://vk.com/wall${post.owner_id}_${post.id}`"
          class="post__source"
        >
          <img :src="sources[post.owner_id][1]" alt="" />
          <p class="sourcename">{{ sources[post.owner_id][0] }}</p>
          <p class="post__date">{{ getPostDate() }}</p>
        </a>
      </div>
      <div class="post__main">
        <div class="post__text">
          <div>
            <p><pre>{{ post.text }}</pre></p>
            <img :src="post.url_photo ? post.url_photo : ''" alt="" />
          </div>
        </div>
        <div class="post__comments">
          <div class="all_comments" v-if="post.comments.length !== 0">
            <div
              class="comment"
              v-for="(comment, index) of post.comments"
              :key="comment[1]"
            >
              <p>{{ comment[1] }}</p>
              <div class="comment__likes">
                  <img src="../assets/posts/like.png" alt="">
                  <p>{{ comment[0] }}</p>
              </div>
              <hr
                v-if="
                  index !== post.comments.length - 1 ||
                  post.comments[index].length > 2
                "
              />
              <div
                  v-for="(commentChild, ind) in post.comments[index]"
                  :key="commentChild"
                >
                  <div v-if="ind === 2" class="first_child_comment">
                    <div class="first_child_comment_text">
                      <img
                        src="../assets/posts/arrowComment.svg"
                        alt="->"
                      />
                      <p>
                        {{ commentChild }}
                      </p>
                    </div>
                    <hr
                      v-if="
                        index !== post.comments.length - 1 ||
                        ind !== post.comments[index].length - 1
                      "
                    />
                  </div>
                  <div v-if="ind > 2" class="comment_child">
                    <p>{{ commentChild }}</p>
                    <hr
                      v-if="
                        index !== post.comments.length - 1 ||
                        ind !== post.comments[index].length - 1
                      "
                    />
                  </div>
                </div>
            </div>
          </div>
          <div v-else class="no_comments">
            <p>Комментарии отсутствуют :(</p>
          </div>
        </div>
      </div>
      <div class="post__stats">
        <div class="stats__likes">
          <img src="../assets/posts/like.png" alt="Лайки:" />
          <p>{{ post.likes }}</p>
        </div>
        <div class="stats__comments">
          <img src="../assets/posts/comment.png" alt="Комменты:" />
          <p>{{ getCommentsCount() }}</p>
        </div>
        <div class="stats__reposts">
          <img src="../assets/posts/repost.png" alt="Репосты:" />
          <p>{{ post.reposts }}</p>
        </div>
        <div class="stats__views">
          <img src="../assets/posts/view.png" alt="Просмотры:" />
          <p>{{ post.views }}</p>
        </div>
      </div>
      <div class="charts">
        <Charts
          :post="post"
          :id="post.id.toString() + post.owner_id.toString()"
          :theme="theme"
        />
      </div>
    </div>
  </div>
</template>

<script>
const sources = require("../services/sources");
import Charts from "./Charts";

export default {
  data() {
    return {
      sources: sources,
    };
  },
  components: {
    Charts,
  },
  props: {
    post: {
      type: Object,
      default() {
        return null;
      },
    },
    theme: String,
  },
  methods: {
    getCommentsCount() {
      const parentCommentsCount = this.post.comments.length;
      let childCommentsCount = 0;
      for (const comment of this.post.comments) {
        childCommentsCount += comment.length - 2;
      }
      return parentCommentsCount + childCommentsCount;
    },
    getPostDate() {
      const postDate = new Date(this.post.date * 1000);
      const day = postDate.getDate();
      const year = postDate.getFullYear();
      const monthNum = (postDate.getMonth() + 1).toString();
      let month = monthNum;
      if (monthNum < 10) month = `0${monthNum}`;
      const hours = postDate.getHours();
      const minutesNum = postDate.getMinutes();
      let minutes = minutesNum;
      if (minutesNum < 10) minutes = `0${minutesNum}`;
      return `${day}.${month}.${year} в ${hours}:${minutes}`;
    },
  },
};
</script>

<style scoped>
.post_container {
  display: flex;
  padding-left: 20px;
  padding-right: 20px;
  justify-content: center;
  margin-top: 40px;
  box-sizing: border-box;
}

.post {
  width: 100%;
}

.post__title {
  display: flex;
}

.post__title a {
  display: flex;
}

.charts {
  display: flex;
  justify-content: space-around;
}

.post__main {
  display: flex;
  padding: 0;
}

.post__source {
  display: flex;
  align-items: center;
  box-sizing: border-box;

  background: white;
  border-radius: 100px;
  width: 49%;
}

.post__source p {
  font-size: var(--fnt-post-1);
  margin-left: 6px;
}

.post__source img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-left: 15px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.post__text {
  margin-top: 15px;
  background: white;
  border-radius: 15px;
  box-sizing: border-box;
  padding-top: 20px;
  padding-left: 25px;
  padding-right: 5px;
  padding-bottom: 15px;
  min-height: 400px;
  max-height: 700px;
  width: 49%;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.post__text div {
  overflow: auto;
  padding-right: 20px;
}

.post__text img {
  margin-top: 20px;
  margin-bottom: 5px;
  min-width: 80%;
  max-width: 100%;
}

.post__text::-webkit-scrollbar,
.post__comments::-webkit-scrollbar,
.all_comments::-webkit-scrollbar,
.post__text div::-webkit-scrollbar {
  width: 7px;
  background-color: var(--clr-scrl-bar);
  border-radius: 13px;
}

.post__text::-webkit-scrollbar-thumb,
.post__comments::-webkit-scrollbar-thumb,
.all_comments::-webkit-scrollbar-thumb,
.post__text div::-webkit-scrollbar-thumb {
  width: 7px;
  background-color: var(--clr-scrl-thumb);
  border-radius: 13px;
}

pre {
  padding: 0;
  margin: 0;
  overflow: auto;
  overflow-y: hidden;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  font-size: 25px;
  line-height: 23px;
}

.post__comments {
  min-height: 400px;
  max-height: 700px;
  margin-left: 17px;
  margin-top: 15px;
  background: white;
  box-sizing: border-box;
  border-radius: 15px;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 25px;
  padding-right: 5px;
  width: 49%;
}

.all_comments {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
  padding-right: 20px;
  box-sizing: border-box;
}

.post__comments p {
  box-sizing: border-box;
  word-wrap: break-word;
  white-space: pre-wrap;
  font-size: 19px;
}

.comment__likes {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.comment_child {
  margin-left: 3vw;
}

.comment_child p {
  margin-bottom: 30px;
}

.comment__likes img {
  width: 22px;
  height: 22px;
  margin-right: 5px;
}

.comment__likes p {
  font-weight: 600;
  min-width: 10px;
  text-align: end;
  font-size: 19px;
  color: var(--clr-standart);
}

.no_comments {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.no_comments p {
  font-size: 30px;
  text-align: center;
}

hr {
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #fff0e1;
  border: 1px solid #fff0e1;
}

.post__title a {
  text-decoration: none;
  outline: none;
}

.post__title a:visited,
.post__title a:link {
  color: black;
}

.post__stats {
  display: flex;
  justify-content: center;
  margin-top: 14px;
  width: calc(49% - 50px);
}

.post__stats div {
  display: flex;
  align-items: center;
}

.post__stats img {
  width: 40px;
  height: 40px;
  margin-left: 45px;
}

.post__stats p {
  font-size: 27px;
  font-weight: 600;
  color: #272727;
  margin-left: 7px;
}

.post__date {
  margin-left: auto !important;
  margin-right: 20px;
  justify-self: flex-end;
  font-size: 25px !important;
}

.comment__likes {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.comment__likes img {
  width: 22px;
  height: 22px;
  margin-right: 5px;
}

.comment__likes p {
  font-weight: 600;
  min-width: 10px;
  text-align: end;
  font-size: 19px;
  color: var(--clr-standart);
}

.first_child_comment hr {
  margin-left: 3vw;
}

.first_child_comment_text {
  display: flex;
  margin-bottom: 30px;
}

.first_child_comment_text img {
  align-self: start;
  margin-left: 1vw;
}

.first_child_comment_text p {
  margin-left: 1vw;
}

@media (max-width: 1600px) {
  .post__source img {
    width: 40px;
    height: 40px;
  }

  .post__source p {
    font-size: var(--fnt-post-2);
  }

  .post__date {
    font-size: 20px !important;
  }

  pre {
    font-size: 20px;
    line-height: 20px;
  }

  .post__comments p {
    box-sizing: border-box;
    word-wrap: break-word;
    white-space: pre-wrap;
    font-size: 15px;
  }

  .post__stats img {
    width: 30px;
    height: 30px;
    margin-left: 35px;
  }

  .post__stats p {
    font-size: 23px;
  }
}

@media (max-width: 992px) {
  .sourcename {
    font-size: 12.5px !important;
  }

  .first_child_comment_text img {
    height: auto;
    margin-left: 0;
    width: 10px;
  }

  .post__source {
    width: 100%;
  }

  .post__text {
    width: 100%;
    padding-left: 5px;
  }

  .post__text div {
    padding-right: 3px;
    padding-left: 3px;
    max-width: 100%;
  }

  .post_container {
    padding-left: 10px;
    padding-right: 5px;
  }

  .post__title img {
    width: 25px;
    height: 25px;
  }

  .post__date {
    font-size: 10px !important;
  }

  .all_comments {
    box-sizing: border-box;
    min-height: 200px;
    max-height: 560px;
  }

  .post__comments {
    min-height: 200px;
    max-height: 600px;
  }

  .post__comments {
    padding-left: 10px;
    box-sizing: border-box;
  }

  .post__comments p {
    font-size: 10px;
  }

  pre {
    max-width: 90%;
    font-size: 11px;
    line-height: 13px;
  }

  .comment__likes img {
    width: 13px;
    height: 13px;
    margin-right: 4px;
  }

  .comment__likes p {
    min-width: 9px;
    font-size: 10px;
  }

  .post__main {
    flex-direction: column;
    width: auto;
    box-sizing: border-box;
  }

  .post__comments {
    width: 100%;
    margin-left: 0;
  }

  .post__stats {
    margin-top: 14px;
    width: calc(100% - 10px);
  }

  .post__stats img {
    width: 16px;
    height: 16px;
    margin-left: 10px;
  }

  .post__stats p {
    font-size: 13px;
    margin-left: 4px;
  }

  .post__text {
    min-height: 200px;
    max-height: 600px;
  }
}

@media (max-width: 384px) {
  .post__text p {
    line-break: anywhere;
  }
}

/* @media (max-width: 361px) {
  .post__text,
  .post__text div,
  .post__main,
  .post__comments,
  .all_comments {
    max-width: 245px;
  }
} */
</style>
