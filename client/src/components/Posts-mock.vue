<template>
  <div>
    <div class="all_posts">
      <div class="post" v-for="post in posts" :key="post.text">
        <div class="source_info">
          <img v-bind:src="sources[post.owner_id][1]" alt="logo" class="logo" />
          <p>{{ sources[post.owner_id][0] }}</p>
        </div>
        <div class="post_content_comments">
          <div class="post_content">
            <div v-if="post.text">
              <div class="post_text">
                <pre>{{ post.text }}</pre>
              </div>
              <center>
                <img
                  v-if="post.url_photo"
                  v-bind:src="post.url_photo"
                  alt="{none}"
                />
              </center>
            </div>

            <div v-else>
              <img v-bind:src="post.url_photo" alt="{none}" />
            </div>

            <div>{{ getDate(post.date) }}</div>
          </div>

          <div class="post_comments">
            <div class="all_comments" v-if="post.comments.length !== 0">
              <div
                class="branch_comment"
                v-for="(comment, index) in post.comments"
                :key="comment"
              >
                <p>{{ comment[1] }}</p>
                <div v-if="comment[0] !== 0" class="comment_likes">
                  <img src="../assets/posts/likeComment.svg" alt="like" />
                  <p>{{ comment[0] }}</p>
                </div>
                <div v-else class="mt30"></div>
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
                        alt="arrow comments"
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
            <div v-else class="no_comments">Комментарии отсутствуют :(</div>
          </div>
        </div>
        <div class="post_metrics">
          <div class="metric">
            <img src="../assets/posts/likePost.svg" alt="post likes" />
            <p>{{ post.likes }}</p>
          </div>
          <div class="metric">
            <img src="../assets/posts/commentPost.svg" alt="post comments" />
            <p>{{ post.comments_count }}</p>
          </div>
          <div class="metric">
            <img src="../assets/posts/repostPost.svg" alt="post reposts" />
            <p>{{ post.reposts }}</p>
          </div>
          <div class="metric">
            <img src="../assets/posts/viewPost.svg" alt="post views" />
            <p>{{ post.views }}</p>
          </div>
        </div>
        <div class="charts">
          <Charts
            v-bind:post="post"
            v-bind:id="post.id.toString() + post.owner_id.toString()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Charts from "./Charts";

const { uri } = require("../env");
async function getData(limit, skip) {
  const rand = Math.floor(Math.random() * 6700) - skip;
  const res = await fetch(`${uri}api/posts?limit=${limit}&skip=${rand}`, {
    method: "GET",
  });
  return res;
}

export default {
  data() {
    return {
      posts: [],
      sources: {
        "-76982440": [
          "Медуза",
          "https://sun1-24.userapi.com/s/v1/ig2/2Y8k8x8enJ7raaMnUDhI2GxS_ooe0oVIxXlLUWJEztbu-LIXD9JmdZkmC0xIvbDL__osl0xAaJ3sCtW6QkVI9Ody.jpg?size=200x0&quality=96&crop=20,20,460,460&ava=1",
        ],
        "-60556804": [
          "Эхо Москвы",
          "https://sun1-86.userapi.com/s/v1/ig2/h4S7lMuJT2NWJgtXPL7ByahoRmdNGszl8CIFl8TM1_vwu9oYgN7I86V82MGdqzTHnAuA2rzLzg4zrET80EJF4T7w.jpg?size=200x0&quality=96&crop=156,140,783,783&ava=1",
        ],
        "-29534144": [
          "Лентач",
          "https://sun1-99.userapi.com/s/v1/ig2/xtJFBRPa19Qj6riYjU6axByE-uRprP6w6HLZ3LxUsYCzJSzBfp0tN-jk6Ne_jyyLKMfTndDFTQeb9hyUCiwFzYxL.jpg?size=200x0&quality=96&crop=6,5,1098,1098&ava=1",
        ],
        "-41232698": [
          "АнтиМайдан",
          "https://sun1-25.userapi.com/s/v1/if1/jCeEQpS_Tnl4E619RxRb7fvUaLepW_TQ8JF36AfX8UQgoWtp5xVoiz3q1kWjX1Bc5MZsQLuC.jpg?size=200x0&quality=96&crop=39,20,539,539&ava=1",
        ],
        "-23482909": [
          "Коммерсант",
          "https://sun1-88.userapi.com/s/v1/if2/YWIrDOyrjw-VjBbsDQCBrQruY4i5UUcwJoho13A-W4QUGKYK1EavXyBpB7zHaJkwXe66djoMs8cybfFrTLIKuUnX.jpg?size=200x0&quality=96&crop=0,0,800,800&ava=1",
        ],
        "-25232578": [
          "РБК",
          "https://sun1-95.userapi.com/s/v1/ig2/0HVlDP6mgsbV0jHfhXbSSMpgeNolDUGTBEOZ7ZYKrVFTz1eFAtSuNqznNY0K5e_mId3XS0xE2v2nwUarvGfe8K5Z.jpg?size=200x0&quality=96&crop=74,81,248,248&ava=1",
        ],
        "-15548215": [
          "Ведомости",
          "https://sun1-98.userapi.com/s/v1/if2/TT1lER7ZfRdyy0mfynIRoaBoL6kvnEZVUXNMDw8o8Dys_AkAIVwrZHspOq7j0uxghsS6WyWnqUEhT68Y4fd6n0vS.jpg?size=200x0&quality=96&crop=0,0,800,800&ava=1",
        ],
        "-27532693": [
          "Известия",
          "https://sun1-17.userapi.com/s/v1/ig2/HpOar5DTp1tfiUIPNGOWzQo5CNeIfI4AHFWSxTm72oXOubJ00FE63MVOzjhQeXkdi0QRouZ5DsMCfJIakz_2KuUK.jpg?size=200x0&quality=96&crop=0,0,1080,1080&ava=1",
        ],
        "-15755094": [
          "РИА Новости",
          "https://sun1-94.userapi.com/s/v1/ig2/iKGZjBAsZ2yQCO8hvt4SwR-AJ0uaHwjHRkqmUEPKrScyyi9cLwYftUDRcg1G0mKFpV3W-6F6pwryMm_oSa_UkTl1.jpg?size=200x0&quality=96&crop=0,0,200,200&ava=1",
        ],
        "-24136539": [
          "ВЕСТИ",
          "https://sun1-88.userapi.com/s/v1/ig2/_b0hUtvCmmj4wWPe0xFd4gzreBFiN9r0YtrtLO0enroaZawHvzT9yCGvSateg5lMI38rAYtVCFNBt6kY1nS4wY5D.jpg?size=200x0&quality=96&crop=0,0,800,800&ava=1",
        ],
      },
    };
  },
  components: {
    Charts,
  },
  methods: {
    async getPosts() {
      try {
        const res =
          this.posts.length === 0
            ? await getData(10, 0)
            : await getData(3, this.posts.length);
        const json = await res.json();
        this.posts = this.posts.concat(json);
      } catch (e) {
        console.error("getPosts function error:\n", e);
      }
    },
    async onScroll() {
      window.onscroll = this.addMorePosts();
    },
    async addMorePosts() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        const res = await getData(3, this.posts.length);
        const json = await res.json();
        this.posts = this.posts.concat(json);
      }
    },
    getDate(date) {
      new Date(date * 1000);
    },
  },
  created() {
    window.addEventListener("scroll", this.onScroll);
  },
  beforeMount() {
    this.getPosts();
  },
};
</script>

<style scoped>
.all_posts {
  display: flex;
  flex-direction: column;
  width: 77vw;
}

.post_content_comments {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.post {
  width: 100%;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
}

.post_content {
  display: flex;
  flex-direction: column;
  max-height: 800px;
  overflow: auto;
  background: #fff;
  border-radius: 15px;
  margin-top: 15px;
  width: 37vw;
}

.post_content pre {
  margin-top: 20px;
  margin-left: 1.5vw;
  margin-right: 1.5vw;
  margin-bottom: 20px;
  text-align: justify;
  font-size: 21px;
  line-height: 23px;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.post_content img {
  max-width: 33vw;
  height: auto;
  align-items: center;
  margin-bottom: 20px;
}

.post_comments {
  margin-top: 15px;
  width: 37vw;
  min-height: 100px;
  max-height: 400px;
  background: #fff;
  border-radius: 15px;
  overflow: auto;
}

.all_comments {
  margin-top: 17px;
  margin-left: 14px;
  margin-right: 14px;
}

.no_comments {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
}

.branch_comment p {
  font-size: 19px;
  line-height: 23px;
  word-wrap: break-word;
  white-space: pre-wrap;
  text-align: justify;
}

.branch_comment hr {
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #fff0e1;
  border: 2px solid #fff0e1;
}

.comment_child {
  margin-left: 3vw;
}

.comment_child p {
  margin-bottom: 30px;
}

.comment_likes {
  display: flex;
  align-items: center;
  margin-top: 10px;
  justify-content: flex-end;
}

.comment_likes div {
  display: flex;
}

.comment_likes p {
  font-size: 19px;
  line-height: 23px;
  color: #939393;
  margin-left: 5px;
}

.comment_likes img {
  width: 23px;
  height: 23px;
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

.post_metrics {
  height: 40px;
  width: 36.7vw;
  margin-left: 0.8vw;
}

.post_metrics {
  margin-top: 23px;
  display: flex;
  justify-content: center;
}

.metric {
  display: flex;
  width: 7vw;
}

.metric img {
  width: 38.61px;
  height: 38.61px;
}

.metric p {
  font-size: 27px;
  margin-left: 3px;
  font-weight: bold;
}

.charts {
  display: flex;
  justify-content: space-around;
}

.source_info {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 100px;
  width: 37vw;
  height: 81px;
  margin-left: 0.8vw;
}

.source_info p {
  font-weight: 700px;
  font-size: 30px;
  line-height: 43px;
  margin-left: 6px;
}

.logo {
  margin-left: 15px;
  border-radius: 250px;
  width: 60px;
  height: 60px;
}
</style>
