<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-transparent">
      <q-toolbar class="bg-transparent">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> </q-toolbar-title>

        <div></div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above class="row">
      <div class="outside-nav column">
        <span class="logo">
          <AlephLogoIcon />
        </span>
        <q-btn href="https://app.aleph.cloud/console/" target="_blank">
          <q-icon size="0.875rem">
            <ConsoleIcon />
          </q-icon>
        </q-btn>
        <q-btn href="https://app.aleph.cloud/account/" target="_blank">
          <q-icon size="0.875rem">
            <AccountIcon />
          </q-icon>
        </q-btn>
        <q-btn href="https://app.aleph.cloud/explorer/" target="_blank">
          <q-icon size="0.875rem">
            <ExplorerIcon />
          </q-icon>
        </q-btn>
        <q-btn to="/" class="active">
          <q-icon size="0.875rem">
            <SwapIcon />
          </q-icon>
        </q-btn>
      </div>
      <div class="col-grow main-sidebar">
        <q-list class="text-bold">
          <q-item-label header>SWAP</q-item-label>

          <q-item to="/" clickable tag="a" exact>
            <q-item-section avatar>
              <q-icon name="swap_horiz" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Swap</q-item-label>
            </q-item-section>
          </q-item>

          <q-item to="/history" clickable tag="a" exact>
            <q-item-section avatar>
              <q-icon name="history" />
            </q-item-section>

            <q-item-section>
              <q-item-label>History</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import AlephLogoIcon from "components/icons/AlephLogoIcon.vue";
import ConsoleIcon from "components/icons/ConsoleIcon.vue";
import AccountIcon from "components/icons/AccountIcon.vue";
import ExplorerIcon from "components/icons/ExplorerIcon.vue";
import SwapIcon from "components/icons/SwapIcon.vue";

const linksList = [
  {
    title: "Docs",
    caption: "quasar.dev",
    icon: "school",
    link: "https://quasar.dev",
  },
  {
    title: "Github",
    caption: "github.com/quasarframework",
    icon: "code",
    link: "https://github.com/quasarframework",
  },
  {
    title: "Discord Chat Channel",
    caption: "chat.quasar.dev",
    icon: "chat",
    link: "https://chat.quasar.dev",
  },
  {
    title: "Forum",
    caption: "forum.quasar.dev",
    icon: "record_voice_over",
    link: "https://forum.quasar.dev",
  },
  {
    title: "Twitter",
    caption: "@quasarframework",
    icon: "rss_feed",
    link: "https://twitter.quasar.dev",
  },
  {
    title: "Facebook",
    caption: "@QuasarFramework",
    icon: "public",
    link: "https://facebook.quasar.dev",
  },
  {
    title: "Quasar Awesome",
    caption: "Community Quasar projects",
    icon: "favorite",
    link: "https://awesome.quasar.dev",
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
    AlephLogoIcon,
    ConsoleIcon,
    AccountIcon,
    ExplorerIcon,
    SwapIcon,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
