<template lang="pug">
  .Tree()
    NodeList(:value="root" ref="nodeList" :path="sourcePath" @click="nodeListClick($event, 0)")
    NodeList(v-for="(item, index) in nodeLists" ref="nodeLists" :key="index" :value="item" @click="nodeListClick($event, index + 1)")
    EmptyNodeList
    EmptyNodeList
</template>

<script lang="ts">
import {Component, Emit, Prop, Provide, ProvideReactive, Vue} from 'vue-property-decorator';
import {Loading, Node as NodeInfo} from './classDef';
import Node from '@/components/FileTree/Node.vue';
import NodeList from '@/components/FileTree/NodeList.vue';
import EmptyNodeList from '@/components/FileTree/EmptyNodeList.vue';
import {typeOf} from '@/utils/utils';

const nodeBackup = [];

@Component({
  components: {EmptyNodeList, NodeList, Node},
})
export default class Tree extends Vue {

  get root() {
    return {
      name: this.sourcePath,
      leaf: false,
      children: this.value,
    };
  }

  public value: NodeInfo[] = [];
  @Provide()
  public nodeLists: NodeInfo[] = [];
  public loadingList: Loading[] = [];
  @ProvideReactive()
  public nowNode: NodeInfo | null = null;
  public nowNodePath: string = '';
  public $refs!: {
    nodeList: NodeList,
    nodeLists: NodeList[],
  };

  @Prop(Function)
  private readonly load!: (node: NodeInfo, path: string) => {};

  @Prop({type: Boolean, default: false})
  @Provide()
  private readonly hasSearcher!: boolean;

  @Prop({type: Array, required: true})
  private readonly data!: NodeInfo[];

  @Prop({type: String, default: '/'})
  private readonly sourcePath!: string;

  @Prop({type: String, default: '暂无数据'})
  @Provide()
  private readonly emptyText!: string;

  @Emit('click')
  public click() {
    return {node: this.nowNode, path: this.nowNodePath};
  }

  public path(node: NodeInfo, index: number) {
    return [
      ...this.sourcePath.split('/'),
      ...this.nodeLists.map((i) => i.name).splice(0, index), node.name]
        .join('/')
        .replace(/\/+/g, '/');
  }

  public setNowNode(node: NodeInfo, path: string) {
    this.nowNode = node;
    this.nowNodePath = path;
  }

  public nodeListClick(node: NodeInfo, index: number) {
    this.setNowNode(node, this.path(node, index));
    this.setNodeLists(node, index);
  }

  public async setNodeLists(node: NodeInfo, index: number) {
    if (!node.isLeaf) {
      if (this.nodeLists.indexOf(node) === -1) {
        this.nodeLists.splice(index, this.nodeLists.length - index, node);
        this.loadingList.splice(index, this.loadingList.length - index, new Loading());
      }

      if (!node.children) {
        this.loadingList[index].loading = true;
        const data = await this.load(node, this.nowNodePath);
        this.$set(node, 'children', data);
        node._children = node.children!.map((_: any) => _);
        this.loadingList[index].loading = false;
      } else {
        if (node._children) {
          node.children = node._children;
        } else {
          node._children = node.children!.map((_) => _);
        }
      }
    } else {
      this.nodeLists.splice(index, this.nodeLists.length - index);
    }

    this.scroll(index);

    this.click();
  }

  public scroll(index: number) {
    setTimeout(() => {
      const nodeListWidth = this.$refs.nodeList.$el.clientWidth;
      const scrollWidth = this.$el.scrollWidth;
      const clientWidth = this.$el.clientWidth;
      this.$el.scrollTo({
        left: scrollWidth - (
            clientWidth + nodeListWidth * (this.nodeLists.length - index + 1 ? this.nodeLists.length - index + 1 : 0)
        ),
        top: 0,
        behavior: 'smooth',
      });
      this.refreshNodeList(index);
    }, 100);
  }

  public refreshNodeList(index: number) {
    if (index < this.nodeLists.length) {
      this.$refs.nodeLists[index].refresh();
    }
  }

  public created() {
    this.value = this.data.map((_) => _);
    nodeBackup.push(this.data.map((_) => _));
  }
}
</script>

<style scoped lang="stylus">
.Tree {
  height 100%
  width 100%
  overflow-x auto
  display flex
  border 1px solid #e8ecef
  border-right none
}
</style>
