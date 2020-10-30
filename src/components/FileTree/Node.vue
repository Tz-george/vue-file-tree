<template lang="pug">
  .Node(:class="classType" @click="click")
    .text(:title="node.name") {{ node.name }}
</template>

<script lang="ts">
import {Component, Prop, Emit, Vue} from 'vue-property-decorator';
import {Node as NodeInfo} from './classDef';

@Component
export default class Node extends Vue {
  @Prop({type: Object, required: true}) public node!: NodeInfo;

  get classType() {
    if (this.node.isLeaf) {
      return 'file';
    } else {
      return 'dir';
    }
  }

  @Emit('click') public click(event: MouseEvent) {
    return event;
  }
}
</script>

<style scoped lang="stylus">
.Node {
  width: 100%
  display flex
  cursor pointer
  align-items center
  padding 4px 10px
  box-sizing border-box

  &::before {
    content ""
    height 16px
    width 16px
    mask-repeat no-repeat
    mask-size 16px
    background-color #61c4fa
    margin-right 8px
  }
}

.text {
  width calc(100% - 16px - 8px)
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
}

.dir {
  &::before {
    mask-image url("./images/folder.png")
  }
}

.file {
  &::before {
   mask-image url("./images/file.png")
  }
}
</style>
