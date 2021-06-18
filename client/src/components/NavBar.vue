<template>
  <nav>
    <AuthModal
      v-if="showAuthModal"
      @success="success"
      @closed="modalClose"
      @register="registerUser"
    />
    <RegModal
      v-if="showRegModal"
      @success="success"
      @closed="modalClose"
      @auth="authUser"
    />
    <div class="logo" @click="logoClick">
      <img src="../assets/logo.png" alt="logo" />
      <p>Response Summoner</p>
    </div>
    <div class="navigations">
      <ul class="navigations__menu">
        <li>
          <router-link class="navrefs" to="/">
            <img src="../assets/nav/home.png" alt="home" class="icon" />
            <span>Главная</span>
          </router-link>
        </li>
        <li>
          <router-link class="navrefs" to="/analysis">
            <img src="../assets/nav/analysis.png" alt="home" class="icon" />
            <span>Анализ</span>
          </router-link>
        </li>
        <li>
          <router-link class="navrefs" to="/about">
            <img src="../assets/nav/about.png" alt="home" class="icon" />
            <span>О нас</span>
          </router-link>
        </li>
      </ul>
    </div>

    <UserSelect
      :isAuthorized="isAuthorized"
      :username="userInfo"
      :key="render"
      @logout="logout"
      @userButtonClick="userButtonClick"
    />
  </nav>
</template>

<script>
import AuthModal from "./AuthModal";
import RegModal from "./RegModal";
import UserSelect from "./UserSelect";
import { sleep } from "../services/actions";
import { getUser } from "../services/api";

export default {
  components: {
    AuthModal,
    RegModal,
    UserSelect,
  },
  data() {
    return {
      userInfo: "Войти",
      isAuthorized: false,
      showAuthModal: false,
      showRegModal: false,
      render: 0,
    };
  },
  methods: {
    logoClick() {
      this.$router.push("/");
    },
    userButtonClick() {
      if (!localStorage.getItem("token") && !localStorage.getItem("userId"))
        this.showAuthModal = true;
    },
    registerUser() {
      this.showAuthModal = false;
      this.showRegModal = true;
    },
    authUser() {
      this.showRegModal = false;
      this.showAuthModal = true;
    },
    async modalClose() {
      await sleep(200);
      this.showAuthModal = false;
      this.showRegModal = false;
    },
    async success() {
      await this.modalClose();
      const res = await getUser(localStorage.getItem("token"));
      if (res.status === 200) {
        const json = await res.json();
        this.isAuthorized = true;
        this.render += 1;
        this.userInfo = json.lastName;
      }
    },
    logout() {
      window.location.reload();
      localStorage.clear();
      this.userInfo = "Войти";
    },
  },
  async beforeMount() {
    const token = localStorage.getItem("token");
    if (token) {
      const res = await getUser(token);
      if (res.status === 200) {
        const json = await res.json();
        const jsonimg = json.image;
        if (jsonimg) this.img = jsonimg;
        this.userInfo = json.lastName;
        this.render += 1;
        this.isAuthorized = true;
      } else {
        localStorage.clear();
        window.location.reload();
      }
    }
  },
};
</script>

<style scoped>
nav {
  background: white;
  border-radius: 0 25px 25px 0;
  width: 23vw;
  max-width: 500px;
  min-width: 150px;
  min-height: 100vh;
  max-height: 100vh;
  box-sizing: border-box;
  position: sticky;
  top: 0px;
  display: flex;
  flex-direction: column;
}

.logo {
  width: auto;
  display: flex;
  align-items: center;
  margin-top: 38px;
  margin-left: 37px;
  cursor: pointer;
}

.logo img {
  width: 83px;
  height: auto;
}

.logo p {
  font-weight: 500;
  font-size: 1em;
  line-height: 37px;
  width: 201px;
  margin-left: 17px;
  color: var(--clr-standart);
}

.navigations {
  padding-top: 50px;
  padding-left: 37px;
  font-size: var(--fnt-nav-1);
  display: flex;
  flex-direction: column;
}

.navigations__menu {
  list-style-type: none;
}

.navigations__menu li {
  margin-top: 19px;
  display: flex;
  align-items: center;
}

.icon {
  width: 29px;
  height: auto;
}

.navrefs {
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: 0.2s;
}

.navrefs span {
  margin-left: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* .navrefs span::after{
        transition: 0.25s ease-in-out;
        content: ''
        width: 34%;
        height: 1px;
        display: block;
        background-color: var(--clr-standart);
        opacity: 0;
    } */
.navrefs:hover {
  transform: scale(1.04);
}
/*
    .navrefs span:hover::after {
        transform: scaleX(3);
        opacity: 1;
    } */

.navrefs:link,
.navrefs:visited {
  color: black;
}

.navrefs:hover {
  color: var(--clr-standart);
}

@media (max-width: 1600px) {
  .logo {
    margin-left: 24px;
  }

  .logo img {
    width: 70px;
  }

  .logo p {
    font-size: 25.3px;
    line-height: 31.2px;
    margin-left: 14.3px;
  }

  .navigations {
    padding-top: 40px;
  }

  span {
    font-size: var(--fnt-nav-2);
  }

  .icon {
    width: 21px;
  }
}

@media (max-width: 1200px) {
  .logo {
    margin-left: 18px;
  }

  .logo img {
    width: 60px;
  }

  .logo p {
    font-size: 21.7px;
    margin-left: 12.3px;
    line-height: 26.8px;
  }

  .navigations {
    padding-top: 40px;
  }

  span {
    font-size: var(--fnt-nav-3);
  }
}

@media (max-width: 992px) {
  .nav {
    width: 20vw;
    min-width: 100px;
  }

  .logo {
    margin-left: 0;
    justify-content: center;
  }

  .logo p {
    display: none;
  }

  .navigations {
    padding-left: 0;
    padding-top: 30px;
    font-size: var(--fnt-nav-4);
    align-items: center;
  }

  .icon {
    width: 30px;
    height: auto;
  }

  .navrefs:hover {
    transform: scale(1);
  }

  .navrefs span {
    display: none;
  }
}
</style>
