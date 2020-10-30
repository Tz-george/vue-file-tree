<template lang="pug">
  .NodeList
    .titleBar
      .path(:title="nodePath") {{ nodePath }}
      Searcher(v-if="hasSearcher" ref="searcher" @search="search(value, $event)")
    .list
      .emptyText(v-show="value.children && value.children.length === 0 || !value.children") {{ emptyText }}
      Node(v-for="(node, index) in value.children" :key="index" :node="node" @click="click(node)")
</template>

<script lang="ts">
import {Component, Prop, Emit, Vue, Inject} from 'vue-property-decorator';
import Node from '@/components/FileTree/Node.vue';
import {Node as NodeInfo} from './classDef';
import Searcher from '@/components/Searcher/Searcher.vue';

@Component({
  components: {Searcher, Node},
})
export default class NodeList extends Vue {
  @Prop({type: Object}) public readonly value!: NodeInfo;
  @Prop({type: String, default: ''}) public readonly path!: string;

  @Inject() public readonly hasSearcher!: boolean;
  @Inject() public readonly emptyText!: string;

  public searchValue: string = '';

  public $refs!: {
    searcher: Searcher;
  };

  get nodePath() {
    if (this.path) {
      return this.path;
    } else {
      return '/' + this.value.name;
    }
  }

  @Emit('click') public click(node: NodeInfo) {
    return node;
  }

  public search(node: NodeInfo, value: string) {
    if (!node) {
      this.searchValue = value;
      return;
    }

    if (value) {
      const regexp = new RegExp(value, 'i');
      node.children = node._children!.filter((item: NodeInfo) => regexp.test(item.name));
    } else {
      node.children = node._children;
    }

    this.$forceUpdate();
  }

  public refresh() {
    if (this.hasSearcher) {
      this.$refs.searcher.refresh();
    }
  }
}
</script>

<style scoped lang="stylus">
.NodeList {
  height 100%
  border-right 1px solid #e8ecef
  width 30%
  flex-shrink 0
}

.titleBar {
  display flex
  align-items center
  justify-content space-between
  height 50px
  padding 0 10px
  box-sizing border-box
}

.list {
  height calc(100% - 50px)
  overflow-y auto
}

.path {
  width 50%
  overflow hidden
  white-space nowrap
  text-overflow ellipsis
}
.Searcher {
  width 50%
  flex-shrink 0
}
.emptyText {
  color #999
  padding 0 10px
}
</style>
