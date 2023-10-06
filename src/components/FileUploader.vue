<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useFilesStore } from '@/stores/files'
import { startLoading, endLoading } from '@/utils/loading'
import { generateUuid } from '@/utils/uuid'

const emit = defineEmits(['updateDirectionEmit'])
const filesStore = useFilesStore()

/**
 * 单个文件上传, 弃用
 */
const uploadFile = (fileData: any) => {
  filesStore.addFile(fileData.file)
  console.log(fileData.file)
}
const fileUploadSuccess = () => {
  ElMessage({
    duration: 1000,
    message: '文件上传成功🎉🎉🎉',
    type: 'success'
  })
}

const uploaderContainerRef = ref()
const iconShow = ref<boolean>(true)
/**
 * 使用showDirectoryPicker获取文件夹
 */
const selectDirection = async () => {
  try {
    const directoryHandle = await window.showDirectoryPicker()
    iconShow.value = false
    startLoading(uploaderContainerRef.value)
    filesStore.fileTrees.push(await generateFileTree(directoryHandle))
    emit('updateDirectionEmit')
    await endLoading()
    ElMessage({
      duration: 2000,
      message: `文件加载成功🎉🎉🎉`,
      type: 'success'
    })
  } catch (error) {
    ElMessage({
      duration: 2000,
      message: `${error}`,
      type: 'error'
    })
  }
  iconShow.value = true
}

/**
 * 递归生成文件树
 */
async function generateFileTree(directoryHandle: any, parent = null) {
  const tree = {
    id: generateUuid(),
    label: directoryHandle.name,
    type: directoryHandle.kind,
    children: [] as any,
    rootId: parent
  }
  try {
    for await (const entry of directoryHandle.entries()) {
      if (entry[1].kind == 'file') {
        if (entry[1].name.slice(-3) == 'zip') {
          continue
        }
        tree.children.push({
          id: generateUuid(),
          label: entry[1].name,
          type: entry[1].kind,
          handle: entry[1],
          rootId: parent ? parent : tree.id
        })
      } else if (entry[1].kind == 'directory') {
        tree.children.push(await generateFileTree(entry[1], tree.id as any))
      }
    }
  } catch (error) {
    ElMessage({
      duration: 2000,
      message: `${error}`,
      type: 'error'
    })
  }
  return tree
}
</script>

<template>
  <div
    class="uploader-container"
    ref="uploaderContainerRef"
    element-loading-customClass="loading-container"
  >
    <!-- <el-upload
      :drag="true"
      multiple
      class="upload-area"
      :http-request="uploadFile"
      :on-change="fileUploadSuccess"
    >
      <el-icon class="file-uploader-icon"><upload-filled /></el-icon
    ></el-upload> -->
    <el-icon v-if="iconShow" class="file-uploader-icon" @click="selectDirection"
      ><upload-filled
    /></el-icon>
  </div>
</template>

<style lang="less" scoped>
.uploader-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  :deep(.el-loading-text) {
    font-style: italic;
    color: #a8abb2;
  }
  .upload-area {
    :deep(.el-upload-dragger) {
      // background-color: #c6e2ff;
      background-color: rgba(1, 1, 1, 0);
      border: none;
    }
    :deep(.el-upload-list__item) {
      display: none;
    }
    .file-uploader-icon {
      color: #a8abb2;
      font-size: 47px;
    }
  }
  .file-uploader-icon {
    color: #a8abb2;
    font-size: 47px;
    transition: all 0.1s ease-in-out;
    &:hover {
      font-size: 62px;
      transition: all 0.1s ease-in-out;
    }
  }
}
</style>
