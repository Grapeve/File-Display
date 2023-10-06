<script setup lang="ts">
import { ref } from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { ElMessage } from 'element-plus'
import FileUploader from '@/components/FileUploader.vue'
import FilePreview from '@/components/FilePreview.vue'
import UpdateLog from '../components/UpdateLog.vue'
import { useFilesStore } from '@/stores/files'
import packageJson from '../../package.json'

const filesStore = useFilesStore()

interface Tree {
  label: string
  handle?: FileSystemFileHandle
  children?: Tree[]
  type?: string
  id?: number
  rootId?: any
}

const treeProps = {
  children: 'children',
  label: 'label'
}

// 生成树形控件数据
const treeData = ref<Tree[]>([])
const updateDirection = () => {
  // 已经渲染好的数据不应该变空重置，应该直接加入新的树形数据
  // treeData.value = []
  // filesStore.fileTrees.forEach((fileTree: any) => {
  //   const tree = convertFileTreeData(fileTree) as Tree
  //   treeData.value?.push(tree)
  // })
  filesStore.fileTrees.forEach((fileTree: any) => {
    if (!treeData.value.find((treeNode) => treeNode.id == fileTree.id)) {
      treeData.value?.push(fileTree)
    }
  })
}

// 生成树形控件所需的数据 (弃用)
const convertFileTreeData = (fileTree: any) => {
  if (!fileTree || typeof fileTree !== 'object') {
    return null
  }
  const treeNode: Tree = {
    label: fileTree.name
  }
  if (fileTree.type === 'directory' && Array.isArray(fileTree.children)) {
    treeNode.children = fileTree.children.map((child: any) => convertFileTreeData(child))
  } else if (fileTree.type === 'file') {
    treeNode.handle = fileTree.handle
  }
  return treeNode
}

const treeNodeSelect = ref<File>()
// 树形控件删除
const remove = (node: Node, data: Tree) => {
  const parent = node.parent
  const children: Tree[] = parent.data.children || parent.data
  const index = children.findIndex((d) => d.label === data.label)
  children.splice(index, 1)
  // treeData.value = [...treeData.value] // TODO: 由于我只删根文件夹, 这段代码似乎没意义?
  filesStore.deleteFolderId = data.id
  filesStore.deleteFileTree(data.id!)
  if (filesStore.deleteFolderId == filesStore.previewFolderId) {
    treeNodeSelect.value = undefined // TODO: 不用undefined有没有更好的方法?
  }
  ElMessage({
    duration: 1500,
    message: '文件夹删除成功',
    type: 'success'
  })
}

// 选择要预览的文件
const filePreviewRef = ref()
const handleNodeClick = async (data: Tree) => {
  if (!data.children) {
    treeNodeSelect.value = await data.handle?.getFile()
    filesStore.previewFolderId = data.rootId
  }
}
</script>

<template>
  <div class="file-display-layout">
    <el-container>
      <el-aside width="234px" class="file-display-aside">
        <div>
          <!-- 文件上传区域 -->
          <div style="color: #606266; margin: 10px 0 0 10px; font-weight: 800">⏫上传区域</div>
          <div class="file-display-upload-area">
            <FileUploader @updateDirectionEmit="updateDirection"></FileUploader>
          </div>
        </div>
        <div>
          <!-- 文件目录 -->
          <div style="color: #606266; margin: 20px 0 0 10px; font-weight: 800">📑文件目录</div>
          <el-tree
            class="file-display-tree"
            style="background-color: rgba(0, 0, 0, 0)"
            :data="treeData"
            :props="treeProps"
            @node-click="handleNodeClick"
          >
            <template #default="{ node, data }">
              <span class="custom-tree-node">
                <span>{{ node.label }}</span>
                <span v-if="node.level == 1">
                  <button
                    style="position: absolute; left: 80%"
                    @click="remove(node, data)"
                    class="delete-button"
                  >
                    删除
                  </button>
                </span>
              </span>
            </template>
          </el-tree>
        </div>
      </el-aside>
      <el-container>
        <!-- 网站简介 -->
        <el-header height="10vh" class="file-display-header">
          <div style="height: 100%; display: flex; align-items: center">
            <div style="font-size: 24px">🍞 File-Display v{{ packageJson.version }}</div>
            <span style="font-size: 17px; color: blueviolet; margin-left: 20px"
              >I just want to preview the file on the web, that's all🌰.</span
            >
            <span style="color: blue; margin-left: 5px; font-size: larger"
              >supports <em>.docx .jpg .txt and .md</em> now.</span
            >
          </div>
        </el-header>
        <!-- 文件预览区域 -->
        <el-main class="file-display-main">
          <FilePreview :fileSelect="treeNodeSelect" ref="filePreviewRef" />
        </el-main>
      </el-container>
    </el-container>
    <div class="updatelog"><UpdateLog /></div>
  </div>
</template>

<style lang="less" scoped>
.file-display-layout {
  width: 100wh;
  height: 100vh;
}
.file-display-header {
  margin: 0 0;
  // background-color: #a0cfff;
}
.file-display-aside {
  height: 100vh;
  // background-color: #c6e2ff;
  border-radius: 0 15px 15px 0;
  background: url(https://cdn.pixabay.com/photo/2023/04/27/10/22/cat-7954262_1280.jpg);
  .file-display-upload-area {
    height: 121px;
  }
  .file-display-tree {
    height: 20vh;
    :deep(.el-tree__empty-text) {
      top: 21px;
      left: 30%;
    }
    :deep(.el-tree-node__content) {
      background-color: rgba(0, 0, 0, 0);
      &:hover {
        background-color: rgba(255, 255, 255, 0.08);
      }
    }
  }
}
.file-display-main {
  height: 90vh;
  /* background-color: #337ecc; */
}

.delete-button {
  font-weight: 600;
  color: #606266;
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid #606266;
  border-radius: 5px;
  transition: all 0.2s linear;
  &:hover {
    border: 1px solid #dcdfe6;
    border-color: #f56c6c;
    background-color: #f56c6c;
    color: rgba(255, 255, 255, 0.9);
    transition: all 0.2s linear;
  }
}

.updatelog {
  display: fixed;
  position: absolute;
  top: 10px;
  right: 20px;
  width: 350px;
  background-color: rgba(255, 255, 255, 0);
}
</style>
