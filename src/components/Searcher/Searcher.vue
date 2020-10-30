<template lang="pug">
  .Searcher
    input(v-model="value" ref="input" @keyup.enter="search" @blur="search")
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';

@Component
export default class Searcher extends Vue {
  @Prop({type: Boolean, default: false}) public autoClear!: boolean;
  public value = '';

  @Emit('search') public search() {
    return this.value;
  }

  public refresh() {
    this.value = '';
    this.search();
  }
}
</script>

<style scoped lang="stylus">
.Searcher {
  padding 6px 10px
  display flex
  align-items center
  border-radius 8px
  width 100%
  border 1px solid #e8ecef
  &::after {
    content ""
    height 20px
    width 20px
    flex-shrink 0
    mask url("./images/search.png") no-repeat center
    mask-size 20px
    background-color #0c6dff
    margin-left 8px
  }
}
input {
  border none
  outline none
  flex-shrink 2
  width calc(100% - 20px)
}
</style>
