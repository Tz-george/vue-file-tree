<template lang="pug">
  #app
    Tree(:data="data" :load="load" has-searcher)
</template>

<style lang="stylus">

</style>
<script>
import Vue from "vue";
import {Component} from "vue-property-decorator";
import Tree from "@/components/FileTree/Tree";

@Component({
  components: {Tree}
})
export default class App extends Vue {
  data = [
    {name: 'root', isLeaf: false, children: [
        {name: "junjie", isLeaf: false, children: [
            {name: "project", isLeaf: false}
          ]},
        {name: "george", isLeaf: false, children: [
            {name: "project", isLeaf: false}
          ]},
      ]},
    {name: 'dir', isLeaf: false, children: [
        {name: 'test', isLeaf: false}
      ]},
    {name: "mnt", isLeaf: false},
    {name: "test.txt", isLeaf: true},
  ]

  load(node, path) {
    node.children = [];
  }
}
</script>

<style lang="stylus" scoped>
#app {
  height 100vh
  width 100vw
}
</style>
